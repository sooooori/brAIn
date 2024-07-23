package com.ssafy.brAIn.member.repository;

import com.ssafy.brAIn.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {

    // 이메일 중복 검사 위한 메서드 추가
    boolean existsByEmail(String email);

    // 이메일로 사용자 정보 가져오기
    Optional<Member> findByEmail(String email);

}
