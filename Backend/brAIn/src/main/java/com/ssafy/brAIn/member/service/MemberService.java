package com.ssafy.brAIn.member.service;

import com.ssafy.brAIn.member.dto.MemberDto;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public Member save(MemberDto memberDto) {
        return memberRepository.save(memberDto.toMember());
    }
}