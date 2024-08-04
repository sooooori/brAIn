package com.ssafy.brAIn.stomp.config;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

import java.io.IOException;

public class SecurityContextWebSocketHandlerDecorator extends WebSocketHandlerDecorator {
    public SecurityContextWebSocketHandlerDecorator(WebSocketHandler delegate) {
        super(delegate);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws IOException, Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        // SecurityContext가 올바르게 설정되어 있는지 확인
        System.out.println("SecurityContext in WebSocketHandler:" + (context.getAuthentication() != null ? context.getAuthentication().getAuthorities() : "No Authentication"));
        super.handleMessage(session, message);
    }

}
