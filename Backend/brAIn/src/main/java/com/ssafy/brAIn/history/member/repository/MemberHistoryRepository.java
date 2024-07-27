package com.ssafy.brAIn.history.member.repository;

import com.ssafy.brAIn.history.member.entity.MemberHistory;
import com.ssafy.brAIn.history.member.entity.MemberHistoryId;
import com.ssafy.brAIn.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberHistoryRepository extends JpaRepository<MemberHistory, Integer> {

    MemberHistory findById(MemberHistoryId memberHistoryId);
}
