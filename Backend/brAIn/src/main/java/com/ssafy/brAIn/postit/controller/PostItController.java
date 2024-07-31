package com.ssafy.brAIn.postit.controller;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomResponse;
import com.ssafy.brAIn.postit.service.PostItService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/postIts")
public class PostItController {

    private final PostItService postItService;

    @Autowired
    public PostItController(PostItService postItService) {
        this.postItService = postItService;
    }

    @PostMapping
    public ResponseEntity<?> postIt(@RequestBody Map<String,String> content,  StompHeaderAccessor accessor) {
        String roomToken=accessor.getFirstNativeHeader("Authorization");
        String contentText = content.get("content");
        if(postItService.postItMake(roomToken, contentText)){
            return ResponseEntity.status(201).body("오케이");
        }
        else{
            return ResponseEntity.status(500).build();
        }
    }
}
