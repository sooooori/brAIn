package com.ssafy.brAIn.stomp.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.file.AccessDeniedException;

public class AuthorizationChannelInterceptor implements ChannelInterceptor {

    private final AuthorizationManager<Message<?>> authorizationManager;

    public AuthorizationChannelInterceptor(AuthorizationManager<Message<?>> authorizationManager) {
        this.authorizationManager = authorizationManager;
    }

//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//
//        Authentication authentication = new UsernamePasswordAuthenticationToken(
//                memberHistory, null, memberHistory.getAuthorities());
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null) {
//            throw new AuthenticationCredentialsNotFoundException("Authentication object is not found in the SecurityContext");
//        }
//
//        // 인증 확인을 수행합니다.
//        return authorizationManager.check(authentication).filter(authorized -> true).orElseThrow(() ->
//                new AccessDeniedException("Access is denied"));
//    }
}