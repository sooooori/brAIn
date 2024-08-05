package com.ssafy.brAIn.postit.controller;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomResponse;
import com.ssafy.brAIn.postit.entity.PostItKey;
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
    public ResponseEntity<?> postIt(@RequestBody Map<String,String> content, @RequestHeader("Authorization") String token) {
        String contentText = content.get("context");
        System.out.println(contentText);
        System.out.println(token);
        PostItKey postItKey = postItService.postItMake(token, contentText);
        return ResponseEntity.ok(postItKey);
    }

    @DeleteMapping
    public ResponseEntity<?> postIt(@RequestBody PostItKey postIt, @RequestHeader("Authorization") String token) {
        if(postItService.deletePostIt(token, postIt)){
            return ResponseEntity.status(201).body("오케이");
        }
        else{
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping()
    public ResponseEntity<?> updatePostIt(@RequestBody PostItKey postItKey, @RequestHeader("Authorization") String token) {
        if(postItService.updatePostIt(token, postItKey)){
            return ResponseEntity.status(201).body("오케이");
        }
        else{
            return ResponseEntity.status(500).build();
        }
    }
}
