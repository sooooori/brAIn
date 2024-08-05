package com.ssafy.brAIn.stomp.config;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;

public class SecurityContextWebSocketHandlerDecoratorFactory implements WebSocketHandlerDecoratorFactory {
    @Override
    public WebSocketHandler decorate(WebSocketHandler handler) {
        return new SecurityContextWebSocketHandlerDecorator(handler);
    }
}