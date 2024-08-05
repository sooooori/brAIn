package com.ssafy.brAIn.stomp.config;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class MyWebSocketHandler extends TextWebSocketHandler {
    private final ConcurrentHashMap<WebSocketSession, Long> sessions = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public MyWebSocketHandler() {
        scheduler.scheduleAtFixedRate(() -> {
            long currentTime = System.currentTimeMillis();
            sessions.forEach((session, lastPingTime) -> {
                if (currentTime - lastPingTime > 10000) { // 10초 동안 응답이 없으면 연결 종료
                    try {
                        session.close(CloseStatus.GOING_AWAY);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    try {
                        session.sendMessage(new TextMessage("ping"));
                        sessions.put(session, System.currentTimeMillis());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });
        }, 0, 5, TimeUnit.SECONDS); // 5초마다 핑 메시지 전송
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session, System.currentTimeMillis());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if (message.getPayload().equals("pong")) {
            sessions.put(session, System.currentTimeMillis());
        }
    }
}
