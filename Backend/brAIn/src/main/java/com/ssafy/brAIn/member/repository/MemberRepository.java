package com.ssafy.brAIn.member.repository;

import com.ssafy.brAIn.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    // email로 member 찾을수 있도록
    Member findByMember(String email);
}
