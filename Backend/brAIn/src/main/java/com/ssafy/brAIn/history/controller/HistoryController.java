package com.ssafy.brAIn.history.controller;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.exception.UnauthorizedException;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.service.MemberHistoryService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/conferences/history")
public class HistoryController {
    private final MemberHistoryService memberHistoryService;

    //개별 회의 ID 조회
    @GetMapping("/{conferenceId}")
    public ResponseEntity<MemberHistory> getHistoryDetails(@RequestHeader("Authorization") String token, @PathVariable int conferenceId) {
        Claims claims = JwtUtil.extractToken(token);
        if (claims == null) {
            throw new UnauthorizedException("Invalid token");
        }
        int memberId = Integer.parseInt(claims.get("memberId").toString());
        Optional<MemberHistory> history = memberHistoryService.getHistoryDetails(new MemberHistoryId(memberId, conferenceId));
        return history.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 사용자 ID로 모든 회의 조회
    @GetMapping
    public ResponseEntity<?> getAllHistories(@RequestHeader("Authorization") String token) {
        Claims claims = JwtUtil.extractToken(token);
        if (claims == null) {
            throw new UnauthorizedException("Invalid token");
        }
        int memberId = Integer.parseInt(claims.get("memberId").toString());
        List<MemberHistory> histories = memberHistoryService.getAllHistories(memberId);
        return ResponseEntity.ok(histories);
    }

    // 새로운 회의 기록 생성 + 중간 회의록
    @PostMapping
    public ResponseEntity<MemberHistory> createHistory(@RequestBody MemberHistory memberHistory) {
        MemberHistory createdHistory = memberHistoryService.saveHistory(memberHistory);
        return ResponseEntity.ok(createdHistory);
    }
}
