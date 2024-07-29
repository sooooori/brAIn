package com.ssafy.brAIn.conferenceroom.controller;

import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomResponse;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.service.ConferenceRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/conferences")
public class ConferenceRoomController {

    private final ConferenceRoomService conferenceRoomService;

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getConferenceRoom(@PathVariable String roomId) {
        return ResponseEntity.status(200).body(roomId);
    }

    @PostMapping()
    public ResponseEntity<?> addConferenceRoom(@RequestBody ConferenceRoomRequest conferenceRoomRequest) {
        ConferenceRoom cr = conferenceRoomRequest.toConferenceRoom();
        conferenceRoomService.save(cr);
        ConferenceRoomResponse crr = new ConferenceRoomResponse(cr);
        return ResponseEntity.status(201).body(crr);
    }
}
