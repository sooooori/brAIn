package com.ssafy.brAIn.stomp.config;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.member.repository.MemberRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration
public class HttpSessionHandshakeInterceptor implements HandshakeInterceptor {

    private final MemberHistoryRepository memberHistoryRepository;
    private final JWTUtilForRoom jwtUtilForRoom;
    private final MemberRepository memberRepository;

    public HttpSessionHandshakeInterceptor(MemberHistoryRepository memberHistoryRepository, JWTUtilForRoom jwtUtilForRoom, MemberRepository memberRepository) {
        this.memberHistoryRepository = memberHistoryRepository;
        this.jwtUtilForRoom = jwtUtilForRoom;
        this.memberRepository = memberRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        String authorizationHeader = request.getHeaders().getFirst("Authorization");

        if (authorizationHeader != null ) {
            String token = authorizationHeader;


            // Validate and parse the JWT token

            Integer roomId = Integer.parseInt(jwtUtilForRoom.getRoomId(token));
            Integer userId = memberRepository.findByEmail(jwtUtilForRoom.getUsername(token)).get().getId();

            MemberHistoryId memberHistoryId = new MemberHistoryId(userId, roomId);
            MemberHistory memberHistory = memberHistoryRepository.findById(memberHistoryId).orElse(null);

            if (memberHistory != null) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        memberHistory, null, memberHistory.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Store the authentication in WebSocket session attributes
                attributes.put("authentication", authentication);
            }

        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // No-op
    }
}
