package com.ssafy.brAIn.conferenceroom.controller;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/test")
public class ConferencesRoomTestController {

    @Autowired
    private JWTUtilForRoom jwtUtilForRoom;

    @PostMapping("/create")
    public ResponseEntity<?> createRoom() {
        String accessToken=jwtUtilForRoom.createJwt("access","h0568@naver.com","CHIEF","하마","1",1650000000L);
        System.out.println();
        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }
}
