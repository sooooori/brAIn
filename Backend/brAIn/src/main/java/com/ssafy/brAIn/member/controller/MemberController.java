package com.ssafy.brAIn.member.controller;

import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class MemberController {

    private final MemberService memberService;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody MemberRequest memberRequest) {
        memberService.join(memberRequest);
        return ResponseEntity.ok(Map.of("message", "Member joined successfully"));
    }
}