package com.ssafy.brAIn.conferenceroom.controller;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomJoinRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomResponse;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.service.ConferenceRoomService;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.service.MemberHistoryService;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.service.MemberService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/conferences")
public class ConferenceRoomController {

    private final ConferenceRoomService conferenceRoomService;
    private final MemberService memberService;
    private final MemberHistoryService memberHistoryService;

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getConferenceRoom(@PathVariable String roomId) {
        return ResponseEntity.status(200).body(roomId);
    }

    @PostMapping()
    public ResponseEntity<?> addConferenceRoom(@RequestBody ConferenceRoomRequest conferenceRoomRequest, @RequestHeader("Authorization") String token) {
        ConferenceRoom cr = conferenceRoomRequest.toConferenceRoom();
        ConferenceRoom saveCr = conferenceRoomService.save(cr);
        token = token.split(" ")[1];
        Claims claims = JwtUtil.extractToken(token);
        String email = claims.get("email").toString();
        Member member = memberService.findByEmail(email).orElse(null);
        memberHistoryService.createRoom(saveCr, member);
        ConferenceRoomResponse crr = new ConferenceRoomResponse(cr);
        return ResponseEntity.status(201).body(crr);
    }

    @GetMapping("/join")
    public ResponseEntity<?> getConferenceRoom(@RequestBody ConferenceRoomJoinRequest conferenceRoomJoinRequest) {
        ConferenceRoom findConference = conferenceRoomService.findByInviteCode(conferenceRoomJoinRequest.getInviteCode());
        ConferenceRoomResponse crr = new ConferenceRoomResponse(findConference);
        return ResponseEntity.status(200).body(crr);
    }

    @PostMapping("/{url}")
    public ResponseEntity<?> joinConferenceRoom(@PathVariable String url, @RequestHeader("Authorization") String token) {
        ConferenceRoom findConference = conferenceRoomService.findBySecureId(url);
        token = token.split(" ")[1];
        Claims claims = JwtUtil.extractToken(token);
        String email = claims.get("email").toString();
        Member member = memberService.findByEmail(email).orElse(null);
        memberHistoryService.joinRoom(findConference, member);
        return ResponseEntity.status(200).body(findConference);
    }
}
