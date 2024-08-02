package com.ssafy.brAIn.conferenceroom.controller;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomJoinRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomResponse;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceMemberRequest;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.service.ConferenceRoomService;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.service.MemberHistoryService;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.service.MemberService;
import com.ssafy.brAIn.util.RandomNicknameGenerator;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/conferences")
public class ConferenceRoomController {

    private final ConferenceRoomService conferenceRoomService;
    private final MemberService memberService;
    private final MemberHistoryService memberHistoryService;

    @Autowired
    private JWTUtilForRoom jwtUtilForRoom;

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

        String jwtTokenForRoom = jwtUtilForRoom.createJwt("access", email, "CHIEF", RandomNicknameGenerator.generateNickname(), saveCr.getId()+"", 100000000L);
//        Member member = memberService.findByEmail(email).orElse(null);
//        memberHistoryService.createRoom(saveCr, member);
        ConferenceRoomResponse crr = new ConferenceRoomResponse(cr, jwtTokenForRoom);
        return ResponseEntity.status(201).body(crr);
    }

    @PostMapping("/join")
    public ResponseEntity<?> getConferenceRoom(@RequestBody ConferenceRoomJoinRequest conferenceRoomJoinRequest) {
        ConferenceRoom findConference = conferenceRoomService.findByInviteCode(conferenceRoomJoinRequest.getInviteCode());

        ConferenceRoomResponse crr = new ConferenceRoomResponse(findConference, "");
        return ResponseEntity.status(200).body(crr);
    }

    @GetMapping
    public ResponseEntity<?> getConferenceRoomsInfo(@RequestParam("secureId") String secureId) {
        ConferenceRoom conferenceRoom = conferenceRoomService.findBySecureId(secureId);

        ConferenceRoomResponse crr = new ConferenceRoomResponse(conferenceRoom, "");
        return ResponseEntity.status(200).body(crr);
    }

    @PostMapping("/{url}")
    public ResponseEntity<?> joinConferenceRoom(@PathVariable String url, @RequestHeader("Authorization") String token) {
        ConferenceRoom findConference = conferenceRoomService.findBySecureId(url);
        token = token.split(" ")[1];
        Claims claims = JwtUtil.extractToken(token);
        String email = claims.get("email").toString();

        String jwtTokenForRoom = jwtUtilForRoom.createJwt("access", email, "MEMBER", RandomNicknameGenerator.generateNickname(), findConference.getId()+"", 100000000L);

        ConferenceRoomResponse crr = new ConferenceRoomResponse(findConference, jwtTokenForRoom);
        return ResponseEntity.status(200).body(crr);
    }


    // 새로운 회의 기록 생성 and 중간 회의록
    @PostMapping("/save")
    public ResponseEntity<?> createHistory(@RequestBody ConferenceMemberRequest conferenceSaveRequest) {
        try {
            ConferenceMemberRequest saveRequestDTO = conferenceRoomService.saveConferenceHistory(conferenceSaveRequest);
            return ResponseEntity.ok(saveRequestDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Conference Room not found");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while saving conference history");
        }
    }
}
