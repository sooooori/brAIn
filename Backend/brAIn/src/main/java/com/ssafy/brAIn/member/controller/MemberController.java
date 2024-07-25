package com.ssafy.brAIn.member.controller;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.service.MemberDetailService;
import com.ssafy.brAIn.member.service.MemberService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberDetailService memberDetailService;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody MemberRequest memberRequest) {
        memberService.join(memberRequest);
        return ResponseEntity.ok(Map.of("message", "Member joined successfully"));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                data.get("email"), data.get("password")
        );
        // 이메일, 비번 DB와 비교
        Authentication auth = authenticationManagerBuilder.getObject().authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(auth);

        String accessToken = JwtUtil.createAccessToken(SecurityContextHolder.getContext().getAuthentication());
        String refreshToken = JwtUtil.createRefreshToken(SecurityContextHolder.getContext().getAuthentication());

        // refreshToken 저장
        memberService.updateRefreshToken(data.get("email"), refreshToken);

        // refreshToken 쿠키에 저장
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setMaxAge(600); // 10분 설정
        cookie.setHttpOnly(true); // 자바스크립트 공격 어렵게
        cookie.setPath("/"); // 쿠키가 전송될 URL
        response.addCookie(cookie);

        // accessToken 발급
        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    // 토큰 재발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (refreshToken == null) {
            throw new BadRequestException("Refresh token is missing");
        }

        Claims claims;
        try {
            claims = JwtUtil.extractToken(refreshToken);
        } catch (Exception e) {
            throw new BadRequestException("Invalid refresh token");
        }

        String email = claims.get("email").toString();
        Member member = memberDetailService.loadUserByUsername(email);

        String newAccessToken = JwtUtil.createAccessToken(new UsernamePasswordAuthenticationToken(member, null));
        String newRefreshToken = JwtUtil.createRefreshToken(new UsernamePasswordAuthenticationToken(member, null));

        // 새 refreshToken을 쿠키에 저장
        Cookie cookie = new Cookie("refreshToken", newRefreshToken);
        cookie.setMaxAge(1209600); // 14일 설정
        cookie.setHttpOnly(true); // 자바스크립트 공격 어렵게
        cookie.setPath("/"); // 쿠키가 전송될 URL
        response.addCookie(cookie);

        // 새 accessToken을 응답 본문에 포함
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setMaxAge(0); // 쿠키 제거
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}