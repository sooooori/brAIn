package com.ssafy.brAIn.member.service;

import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
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
        // 이메일 중복 검사
        if (memberRepository.existsByEmail(memberRequest.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }
        // 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(memberRequest.getPassword());
        memberRepository.save(memberRequest.toEntity(encodedPassword));
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