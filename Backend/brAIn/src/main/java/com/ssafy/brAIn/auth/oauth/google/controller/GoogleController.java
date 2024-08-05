package com.ssafy.brAIn.auth.oauth.google.controller;

import com.ssafy.brAIn.auth.oauth.google.service.GoogleService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/members")
public class GoogleController {

    private final GoogleService googleService;

    @GetMapping("/login/google")
    public ResponseEntity<?> googleLogin(@RequestParam String code, HttpServletResponse response) {
        if (code == null || code.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google Login failed");
        } else {
            String accessToken = googleService.googleLogin(code, response);

            return ResponseEntity.ok(Map.of("accessToken", accessToken, "message", "Login successful"));
        }
    }
}