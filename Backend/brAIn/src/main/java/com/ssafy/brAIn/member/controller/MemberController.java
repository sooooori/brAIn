package com.ssafy.brAIn.member.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.EmailRequest;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.dto.MemberResponse;
import com.ssafy.brAIn.member.dto.PasswordRequest;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.service.EmailService;
import com.ssafy.brAIn.member.service.MemberDetailService;
import com.ssafy.brAIn.member.service.MemberService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/members")
public class MemberController {

    private final MemberService memberService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberDetailService memberDetailService;
    private final EmailService emailService;

    // 이미지파일 2MB로 제한
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;

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

        // Refresh Token 검증 및 클레임 추출
        Claims claims;
        try {
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
    public ResponseEntity<?> getEmail(@RequestBody String email) {
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

    // 이메일 중복 검사
    @PostMapping("/checkEmail")
    public ResponseEntity<?> checkEmail(@RequestBody EmailRequest email) {

        memberService.emailCheck(email.getEmail());
        return ResponseEntity.ok(Map.of("message", "Email check successfully"));
    }

    @PostMapping("/resetEmail")
    public ResponseEntity<?> resetEmail(@RequestBody EmailRequest email) {

        memberService.resetEmail(email.getEmail());
        return ResponseEntity.ok(Map.of("message", "Email check successfully"));
    }

    // 회원정보 조회
    @GetMapping("/member")
    public ResponseEntity<?> getMember(@RequestHeader("Authorization") String token) {
        // Bearer 접두사 제거
        String accessToken = token.replace("Bearer ", "");
        // 조회
        MemberResponse memberResponse = memberService.getMember(accessToken);
        return ResponseEntity.ok(Map.of("member", memberResponse));
    }

    // 회원 탈퇴
    @DeleteMapping("/member")
    public ResponseEntity<?> deleteMember(@RequestHeader("Authorization") String token,
                                          @RequestBody String password,
                                          HttpServletResponse response) {
        // Bearer 접두사 제거
        String accessToken = token.replace("Bearer ", "");
        // 탈퇴
        memberService.deleteMember(accessToken, password);
        // Refresh Token 쿠키 제거
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setMaxAge(0); // 쿠키 제거
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Member deleted successfully"));
    }

    // 회원 프로필 사진 변경
    @PutMapping("/updatePhoto")
    public ResponseEntity<?> updatePhoto(@RequestHeader("Authorization") String token,
                                         @RequestBody ObjectNode requestBody) throws IOException {
        // Bearer 접두사 제거
        String accessToken = token.replace("Bearer ", "");
        // 파일 데이터와 URL을 JSON으로 받음
        String base64FileData = requestBody.has("fileData") ? requestBody.get("fileData").asText() : null;
        String imageUrl = requestBody.has("imageUrl") ? requestBody.get("imageUrl").asText() : null;
        String originalFileName = requestBody.has("fileName") ? requestBody.get("fileName").asText() : null;

        // 업로드 파일 체크 (파일 유무, 용량, URL)
        if (base64FileData != null) {
            if (originalFileName == null) {
                throw new BadRequestException("File name is missing");
            }
            byte[] fileData = Base64.getDecoder().decode(base64FileData);
            if (fileData.length > MAX_FILE_SIZE) {
                throw new BadRequestException("File size exceeds the maximum allowed size of 5MB");
            }
            memberService.uploadUserImage(accessToken, fileData, originalFileName);
        } else if (imageUrl != null) {
            memberService.updateUserImageByUrl(accessToken, imageUrl);
        } else {
            throw new BadRequestException("No file or imageUrl provided");
        }

        return ResponseEntity.ok(Map.of("message", "Profile Image Change Successful"));
    }

    // 비밀번호 재설정(마이페이지에서 비밀번호 변경)
    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> request) {
        // Barer 접두사 제거
        String accessToken = token.replace("Bearer ", "");
        // 비밀번호 재설정
        String email = JwtUtil.getEmail(accessToken);
        String newPassword = request.get("newPassword");

        memberService.resetPassword(email, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    // 비밀번호 찾기(로그인 안한 상태에서 비밀번호 변경)
    @PutMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordRequest passwordRequest) {
        String email = passwordRequest.getEmail();
        String newPassword = passwordRequest.getNewPassword();

        memberService.resetPassword(email, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password update successfully"));
    }

    // 이메일 인증번호 생성
    @PostMapping("/sendAuthNumber")
    public ResponseEntity<?> getEmailForVerification(@RequestBody EmailRequest request) {
        String email = request.getEmail();
        LocalDateTime requestedAt = LocalDateTime.now();
        emailService.sendEmail(email, requestedAt);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email Verification Successful");
    }

    // 이메일 인증번호 인증
    @PostMapping("/authNumber")
    public ResponseEntity<String> verificationByCode(@RequestBody EmailRequest request) {
        LocalDateTime requestedAt = LocalDateTime.now();
        emailService.verifyEmail(request.getEmail(), request.getCode(), requestedAt);
        return ResponseEntity.ok("Email Authentication Completed");
    }
}