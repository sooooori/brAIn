package com.ssafy.brAIn.member.service;

import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    // 회원가입(유저정보 저장)
    public Member join(MemberRequest memberRequest) {
        // 이메일 중복 검사
        if (memberRepository.existsByEmail(memberRequest.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }
        return memberRepository.save(memberRequest.toEntity());
    }
}