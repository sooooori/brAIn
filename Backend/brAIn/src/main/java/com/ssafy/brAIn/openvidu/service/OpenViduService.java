package com.ssafy.brAIn.openvidu.service;

//import io.openvidu.java.client.OpenVidu;
//import io.openvidu.java.client.Session;
//import io.openvidu.java.client.SessionProperties;
//import io.openvidu.java.client.TokenOptions;
//import io.openvidu.java.client.ConnectionProperties;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OpenViduService {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String SECRET;

//    private OpenVidu openVidu;
//    private Map<String, Session> sessions = new ConcurrentHashMap<>();
//    private Map<String, Map<String, String>> sessionTokens = new ConcurrentHashMap<>();
//
//    @PostConstruct
//    public void init() {
//        this.openVidu = new OpenVidu(OPENVIDU_URL, SECRET);
//    }
//
//    // 기본 세션 생성 메소드
//    public String createSession() throws Exception {
//        Session session = openVidu.createSession(new SessionProperties.Builder().build());
//        sessions.put(session.getSessionId(), session);
//        sessionTokens.put(session.getSessionId(), new ConcurrentHashMap<>());
//        return session.getSessionId();
//    }
//
//    // 지정된 세션 ID로 세션 생성
//    public String createSession(String sessionId) throws Exception {
//        SessionProperties properties = new SessionProperties.Builder()
//                .customSessionId(sessionId)
//                .build();
//        Session session = openVidu.createSession(properties);
//        sessions.put(session.getSessionId(), session);
//        sessionTokens.put(session.getSessionId(), new ConcurrentHashMap<>());
//        return session.getSessionId();
//    }
//
//    public String createToken(String sessionId) throws Exception {
//        if (!sessions.containsKey(sessionId)) {
//            createSession(sessionId);
//        }
//        Session session = sessions.get(sessionId);
//        String token = session.createConnection(new ConnectionProperties.Builder().build()).getToken();
//        sessionTokens.get(sessionId).put(token, sessionId);
//        return token;
//    }
}
