package com.ssafy.brAIn.conferenceroom.controller;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class ConferenceRoomController {
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getConferenceRoom(@PathVariable String roomId) {
        return ResponseEntity.status(200).body(roomId);
    }
}
