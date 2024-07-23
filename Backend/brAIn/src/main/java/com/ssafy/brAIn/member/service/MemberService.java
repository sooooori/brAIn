package com.ssafy.brAIn.member.service;

import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
        memberRequest.setPassword(bCryptPasswordEncoder.encode(memberRequest.getPassword()));
        memberRepository.save(memberRequest.toEntity());
    }
}