package com.ssafy.brAIn.history.member.repository;

import com.ssafy.brAIn.history.member.entity.MemberHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberHistoryRepository extends JpaRepository<MemberHistory, Long> {
}
