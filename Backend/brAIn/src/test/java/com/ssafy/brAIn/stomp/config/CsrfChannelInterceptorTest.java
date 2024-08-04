package com.ssafy.brAIn.stomp.config;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.member.service.MemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ExecutorSubscribableChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;

class CsrfChannelInterceptorTest {

    @Autowired
    MemberService memberService;

    private JWTUtilForRoom jwtUtilForRoom;

    private CsrfChannelInterceptor csrfChannelInterceptor;

    @BeforeEach
    public void setup() {
        // JWTUtilForRoom 초기화
        jwtUtilForRoom = new JWTUtilForRoom("vmfhaltmskdlstkfkdgodyroqkfwkdbalroqkfwkdbalaaaaaakkkaaaaaaabbbbb", memberService);
        // WebSocketInterceptor 초기화
        csrfChannelInterceptor = new CsrfChannelInterceptor(jwtUtilForRoom);
    }

    @Test
    public void testAuthorizationForNextStep() {
        // JWT 토큰 생성
        String token = jwtUtilForRoom.createJwt("access", "5@naver.com", "CHIEF", "gi", "8", 100000000L);

        // Stomp 헤더 설정
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.SEND);
        accessor.setDestination("/app/next.step.8");
        accessor.addNativeHeader("Authorization", "Bearer " + token);

        Message<?> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        // PreSend 메서드 호출
        csrfChannelInterceptor.preSend(message, new ExecutorSubscribableChannel());

        // 권한 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication);
        assertTrue(authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CHIEF")));
    }
}