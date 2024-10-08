package com.ssafy.brAIn.member.service;

import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
// ! 스프링 시큐리티에서 사용자 정보를 가져오는 인터페이스 ! -> 일반 Service랑 별도
public class MemberDetailService implements UserDetailsService {

    private final MemberRepository memberRepository;

    // 사용자 이메일로 사용자의 정보를 가져오는 메서드
    @Override
    public Member loadUserByUsername(String email) {
        return memberRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));
    }
}
