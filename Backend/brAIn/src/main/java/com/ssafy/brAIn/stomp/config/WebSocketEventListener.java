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

        System.out.println("최초연결 시:"+token);
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);

            String email = jwtUtilForRoom.getUsername(token);
            Integer roomId = Integer.parseInt(jwtUtilForRoom.getRoomId(token));
            Integer memberId = getMemberId(email);
            Role role = Role.valueOf(jwtUtilForRoom.getRole(token));
            Optional<Member> member = memberRepository.findByEmail(email);
            Optional<ConferenceRoom> room = conferenceRoomRepository.findById(roomId);

            if (member.isEmpty() || room.isEmpty()) {
                //오류
                return;
            }
            MemberHistoryId memberHistoryId = new MemberHistoryId(memberId, roomId);


            MemberHistory memberHistory = MemberHistory.builder().id(memberHistoryId)
                    .role(role)
                    .status(Status.COME)
                    .nickName(jwtUtilForRoom.getNickname(token))
                    .member(member.get())
                    .conferenceRoom(room.get())
                    .build();


            Optional<MemberHistory> optionalMemberHistory = null;
            if (memberHistory != null) {

                System.out.println("User connected: " + memberHistory.getUsername());

                optionalMemberHistory = memberHistoryRepository.findById(memberHistoryId);
                if (optionalMemberHistory.isEmpty()) {
                    memberHistoryRepository.save(memberHistory);
                } else {
                    optionalMemberHistory.get().historyStateUpdate(Status.COME);
                    memberHistoryRepository.save(optionalMemberHistory.get());
                    redisUtils.setSortedSet(roomId + ":order:cur", optionalMemberHistory.get().getOrders(),optionalMemberHistory.get().getNickName());

                }
            }

            if (redisUtils.isValueInSet(roomId + ":out", jwtUtilForRoom.getNickname(token))) {
                redisUtils.removeValueFromSet(roomId + ":out", jwtUtilForRoom.getNickname(token));
            }


            //레디스에 sessionId와 함께 닉네임을 저장해서 갑작스러운 종료 때, 닉네임을 얻기 위함.
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
