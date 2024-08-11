package com.ssafy.brAIn.history.controller;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceMemberRequest;
import com.ssafy.brAIn.history.service.MemberHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/conferences/history")
public class HistoryController {
    private final MemberHistoryService memberHistoryService;

    // 사용자 email로 모든 회의 조회
    // 사용자 토큰을 받아옴 -> jwt 토큰을 파싱하여 사용자 정보 추출 ->
    // history를 통해 사용자 상태 매핑 -> 관련 회의 정보 추출 -> 사용자 참여한 회의 정보 추출
    @GetMapping
    public ResponseEntity<List<ConferenceMemberRequest>> getUserHistory(@RequestHeader("Authorization") String token) {
        // Barer 접두사 제거
        String accessToken = token.replace("Bearer ", "");
        // 사용자 이메일 추출
        String email = JwtUtil.getEmail(accessToken);

        List<ConferenceMemberRequest> userHistory = memberHistoryService.getAllHistories(email);
        return ResponseEntity.ok(userHistory);
    }

    //사용자의 개별 회의 ID 조회
    @GetMapping("/{conferenceId}")
    public ResponseEntity<ConferenceMemberRequest> getUserConferenceHistoryDetails(@RequestHeader("Authorization") String token, @PathVariable int conferenceId) {
        // Barer 접두사 제거
        String accessToken = token.replace("Bearer ", "");
        // 사용자 이메일 추출
        String email = JwtUtil.getEmail(accessToken);
        ConferenceMemberRequest conference = memberHistoryService.getHistoryDetails(email, conferenceId);
        if (conference == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(conference);
    }

    // 닉네임에 따른 프로필 이미지 가져오기
    @GetMapping("/image/{nickname}")
    public ResponseEntity<?> getUserConferenceHistoryNickname(@PathVariable String nickname) {
        try {
            String imageUrl = memberHistoryService.getProfileImageUrlForNickname(nickname);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
