package com.ssafy.brAIn.stomp.config;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.messaging.access.intercept.AuthorizationChannelInterceptor;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
@EnableWebSecurity
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final AuthorizationManager<Message<?>> authorizationManager;
    private final MemberHistoryRepository memberHistoryRepository;
    private final JWTUtilForRoom jwtUtilForRoom;
    private final HttpSessionHandshakeInterceptor httpSessionHandshakeInterceptor;

    public WebSocketConfig(AuthorizationManager<Message<?>> authorizationManager, MemberHistoryRepository memberHistoryRepository, JWTUtilForRoom jwtUtilForRoom, HttpSessionHandshakeInterceptor httpSessionHandshakeInterceptor) {
        this.authorizationManager = authorizationManager;
        this.memberHistoryRepository = memberHistoryRepository;
        this.jwtUtilForRoom = jwtUtilForRoom;
        this.httpSessionHandshakeInterceptor = httpSessionHandshakeInterceptor;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setPathMatcher(new AntPathMatcher("."));
        config.setApplicationDestinationPrefixes("/app")
                .enableStompBrokerRelay("/topic","/queue", "/exchange", "/amq/queue");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*");
//                .addInterceptors(httpSessionHandshakeInterceptor);

    }

//    @Override
//    public void configureClientInboundChannel(ChannelRegistration registration) {
//        registration.interceptors(new AuthorizationChannelInterceptor(authorizationManager));
//    }

}
