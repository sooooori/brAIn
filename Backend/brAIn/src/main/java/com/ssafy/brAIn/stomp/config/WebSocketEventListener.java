package com.ssafy.brAIn.stomp.config;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.model.Status;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.stomp.dto.MessageType;
import com.ssafy.brAIn.stomp.response.ConferencesEnterExit;
import com.ssafy.brAIn.util.RedisUtils;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Optional;

@Component
public class WebSocketEventListener {


    private final ConferenceRoomRepository conferenceRoomRepository;
    private final RedisUtils redisUtils;
    private final JWTUtilForRoom jwtUtilForRoom;
    private final MemberHistoryRepository memberHistoryRepository;
    private final MemberRepository memberRepository;
    private final RabbitTemplate rabbitTemplate;

    public WebSocketEventListener(ConferenceRoomRepository conferenceRoomRepository,
                                  RedisUtils redisUtils,
                                  JWTUtilForRoom jwtUtilForRoom,
                                  MemberRepository memberRepository,
                                  MemberHistoryRepository memberHistoryRepository, @Qualifier("rabbitTemplate") RabbitTemplate rabbitTemplate) {
        this.conferenceRoomRepository = conferenceRoomRepository;
        this.redisUtils = redisUtils;
        this.jwtUtilForRoom = jwtUtilForRoom;
        this.memberRepository = memberRepository;
        this.memberHistoryRepository = memberHistoryRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String token = accessor.getFirstNativeHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);

            String email = jwtUtilForRoom.getUsername(token);
            Integer roomId = Integer.parseInt(jwtUtilForRoom.getRoomId(token));
            Integer memberId = getMemberId(email);
            Role role = Role.valueOf(jwtUtilForRoom.getRole(token));
            Optional<Member> member = memberRepository.findByEmail(email);
            Optional<ConferenceRoom> room = conferenceRoomRepository.findById(roomId);

            if (member.isEmpty() || room.isEmpty()) {
                return; // 로그를 추가하여 문제가 무엇인지 확인할 수도 있습니다.
            }

            MemberHistoryId memberHistoryId = new MemberHistoryId(memberId, roomId);

            MemberHistory memberHistory = MemberHistory.builder()
                    .id(memberHistoryId)
                    .role(role)
                    .status(Status.COME)
                    .nickName(jwtUtilForRoom.getNickname(token))
                    .member(member.get())
                    .conferenceRoom(room.get())
                    .build();

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    memberHistory, null, memberHistory.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<MemberHistory> optionalMemberHistory = memberHistoryRepository.findById(memberHistoryId);
            if (optionalMemberHistory.isEmpty()) {
                memberHistoryRepository.save(memberHistory);
            } else {
                MemberHistory existingHistory = optionalMemberHistory.get();
                existingHistory.historyStateUpdate(Status.COME);
                memberHistoryRepository.save(existingHistory);
                redisUtils.setSortedSet(roomId + ":order:cur", existingHistory.getOrders(), existingHistory.getNickName());
            }

            if (redisUtils.isValueInSet(roomId + ":out", jwtUtilForRoom.getNickname(token))) {
                redisUtils.removeValueFromSet(roomId + ":out", jwtUtilForRoom.getNickname(token));
            }

            String sessionId = accessor.getSessionId();
            redisUtils.save(sessionId, memberId + ":" + roomId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String[] historyId = redisUtils.getData(sessionId).split(":");
        Integer memberId = Integer.parseInt(historyId[0]);
        Integer roomId = Integer.parseInt(historyId[1]);

        MemberHistoryId memberHistoryId = new MemberHistoryId(memberId, roomId);
        MemberHistory memberHistory = memberHistoryRepository.findById(memberHistoryId).get();
        memberHistory.historyStateUpdate(Status.OUT);
        memberHistoryRepository.save(memberHistory);

        redisUtils.setDataInSet(roomId + ":out", memberHistory.getNickName(), 7200L);
        redisUtils.removeValueFromSortedSet(roomId + ":order:cur", memberHistory.getNickName());

        rabbitTemplate.convertAndSend("amq.topic", "roomId." + roomId, new ConferencesEnterExit(MessageType.EXIT, memberHistory.getNickName()));
    }

    private Integer getMemberId(String email) {
        return memberRepository.findByEmail(email).get().getId();
    }
}
