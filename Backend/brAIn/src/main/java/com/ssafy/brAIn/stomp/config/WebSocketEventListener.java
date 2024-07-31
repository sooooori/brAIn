package com.ssafy.brAIn.stomp.config;

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
import com.ssafy.brAIn.util.RedisUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Optional;

@Configuration
public class WebSocketEventListener {


    private final ConferenceRoomRepository conferenceRoomRepository;
    private final RedisUtils redisUtils;
    private JwtUtil jwtUtil;
    private MemberHistoryRepository memberHistoryRepository;
    private MemberRepository memberRepository;

    public WebSocketEventListener(ConferenceRoomRepository conferenceRoomRepository, RedisUtils redisUtils) {
        this.conferenceRoomRepository = conferenceRoomRepository;
        this.redisUtils = redisUtils;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String token = accessor.getFirstNativeHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);

            String email=JwtUtil.getEmail(token);
            Integer roomId=JwtUtil.getRoomId(token);
            Integer memberId=getMemberId(email);
            Role role=Role.valueOf(JwtUtil.getRole(token));
            Optional<Member> member = memberRepository.findByEmail(email);
            Optional<ConferenceRoom> room=conferenceRoomRepository.findById(roomId);

            if (member.isEmpty() || room.isEmpty()) {
                //오류
                return;
            }
            MemberHistoryId memberHistoryId=new MemberHistoryId(memberId,roomId);


            MemberHistory memberHistory=MemberHistory.builder().id(memberHistoryId)
                    .role(role)
                    .status(Status.COME)
                    .nickName(JwtUtil.getNickname(token))
                    .member(member.get())
                    .conferenceRoom(room.get())
                    .build();

            if (memberHistory != null) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(memberHistory, null, memberHistory.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("User connected: " + memberHistory.getUsername());
            }

            //레디스에 sessionId와 함께 닉네임을 저장해서 갑작스러운 종료 때, 닉네임을 얻기 위함.
            String sessionId = accessor.getSessionId();
            redisUtils.save(sessionId,JwtUtil.getNickname(token));
        }
    }

    private Integer getMemberId(String email) {
        Member member =memberRepository.findByEmail(email).get();
        return member.getId();
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        System.out.println("Session ID: " + sessionId + " disconnected.");
        // 추가적인 로직 구현
    }
}
