package com.ssafy.brAIn.auth.oauth.kakao.controller;

import com.ssafy.brAIn.auth.oauth.kakao.service.KakaoService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/members")
public class KakaoController {

    private final KakaoService kakaoService;

    @GetMapping("/login/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam String code, HttpServletResponse response) {
        if (code == null || code.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "KaKao Login failed");
        } else {
            String accessToken = kakaoService.kakaoLogin(code, response);

            return ResponseEntity.ok(Map.of("accessToken", accessToken, "message", "Login successful"));
        }
    }
}
