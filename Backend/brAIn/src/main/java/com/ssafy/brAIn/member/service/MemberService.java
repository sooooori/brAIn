package com.ssafy.brAIn.member.service;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // 회원가입(유저정보 저장)
    public void join(MemberRequest memberRequest) {
        // 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(memberRequest.getPassword());
        memberRepository.save(memberRequest.toEntity(encodedPassword));
    }

    // 이메일 중복 확인
    public void emailCheck(String email) {
        // 이메일 중복 검사
//        System.out.println(email);
        if (memberRepository.existsMemberByEmail(email)) {
            throw new BadRequestException("Email is already in use");
        }
    }


    // 일반 로그인 유저를 위한 토큰 발급 메서드
    public String login(Authentication authentication, HttpServletResponse response) {

        // 인증된 사용자 정보 가져옴
        Member member = (Member) authentication.getPrincipal();

        // accessToken, refreshToken 생성
        String accessToken = JwtUtil.createAccessToken(authentication);
        String refreshToken = JwtUtil.createRefreshToken(authentication);

        // 사용자 DB에 RefreshToken 저장
        member.updateRefreshToken(refreshToken);
        memberRepository.save(member);

        // RefreshToken 쿠키에 저장
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setMaxAge(1209600); // 14일 설정
        cookie.setHttpOnly(true); // HttpOnly 설정
        cookie.setPath("/"); // 쿠키 경로 설정
        response.addCookie(cookie);

        // 생성된 accessToken 반환
        return accessToken;
    }

    // refreshToken 저장
    public void updateRefreshToken(String email, String refreshToken) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        member.updateRefreshToken(refreshToken);
        memberRepository.save(member);
    }

    // 이메일로 사용자 정보 조회
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }
}