package com.ssafy.brAIn.member.controller;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.EmailRequest;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.dto.MemberResponse;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.service.EmailService;
import com.ssafy.brAIn.member.service.MemberDetailService;
import com.ssafy.brAIn.member.service.MemberService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class MemberController {

    private final MemberService memberService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberDetailService memberDetailService;
    private final EmailService emailService;

    // 이메일 중복 검사
    @PostMapping("/checkEmail")
    public ResponseEntity<?> checkEmail(@RequestBody String email) {
        memberService.emailCheck(email);
        return ResponseEntity.ok(Map.of("message", "Email check successfully"));
    }


    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody MemberRequest memberRequest) {
        memberService.join(memberRequest);
        return ResponseEntity.ok(Map.of("message", "Member joined successfully"));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data, HttpServletResponse response) throws IOException {
        // 사용자 인증을 위한 토큰 생성 (이메일, 비밀번호 사용)
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                data.get("email"), data.get("password")
        );

        // 인증 수행 (이메일과 비밀번호를 DB와 비교)
        Authentication auth = authenticationManagerBuilder.getObject().authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(auth);

        // 토큰 발급 (accessToken은 반환, refreshToken은 쿠키저장)
        String accessToken = memberService.login(auth, response);

        return ResponseEntity.ok(Map.of("accessToken", accessToken, "message", "Login successful"));
    }

    // 토큰 재발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

        // 쿠키에서 refreshToken 추출
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        // 없을 때 예외
        if (refreshToken == null) {
            throw new BadRequestException("Refresh token is missing");
        }

        Claims claims;
        try {
            // Refresh Token 검증 및 클레임 추출
            claims = JwtUtil.extractToken(refreshToken);
        } catch (Exception e) {
            throw new BadRequestException("Invalid refresh token");
        }

        // 클레임에서 이메일로 정보 추출
        String email = claims.get("email").toString();
        Member member = memberDetailService.loadUserByUsername(email);

        // 새로운 Access Token 및 Refresh Token 생성
        String newAccessToken = JwtUtil.createAccessToken(new UsernamePasswordAuthenticationToken(member, null));
        String newRefreshToken = JwtUtil.createRefreshToken(new UsernamePasswordAuthenticationToken(member, null));

        // 새 refreshToken을 쿠키에 저장
        Cookie cookie = new Cookie("refreshToken", newRefreshToken);
        cookie.setMaxAge(1209600); // 14일 설정
        cookie.setHttpOnly(true); // 자바스크립트 공격 어렵게
        cookie.setPath("/"); // 쿠키가 전송될 URL
        response.addCookie(cookie);

        // 새 accessToken을 응답 본문에 포함하여 발급
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Refresh Token 쿠키 제거
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setMaxAge(0); // 쿠키 제거
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        // SecurityContext 초기화 (로그아웃 처리)
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // 이메일로 사용자 정보 조회
    @GetMapping("/email")
    public ResponseEntity<?> getEmail(@RequestParam String email) {
        // 이메일로 사용자 정보 조회
        Optional<Member> member = memberService.findByEmail(email);
        if (member.isPresent()) {
            // MemberResponse Dto로 필요한 정보만 반환
            MemberResponse memberResponse = MemberResponse.fromEntity(member.get());
            return ResponseEntity.ok(Map.of("member", memberResponse));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");
        }
    }

    // 이메일 인증번호 생성
    @PostMapping("/sendAuthNumber")
    public ResponseEntity<String> getEmailForVerification(@RequestBody EmailRequest request) {
        String email = request.getEmail();
        LocalDateTime requestedAt = LocalDateTime.now();
        emailService.sendEmail(email, requestedAt);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email Verification Successful");
    }


    // 이메일 인증번호 인증하기
    @PostMapping("/authNumber")
    public ResponseEntity<String> verificationByCode(@RequestBody EmailRequest request) {
        LocalDateTime requestedAt = LocalDateTime.now();
        emailService.verifyEmail(request.getEmail(), request.getCode(), requestedAt);
        return ResponseEntity.ok("Email Authentication Completed");
    }
}