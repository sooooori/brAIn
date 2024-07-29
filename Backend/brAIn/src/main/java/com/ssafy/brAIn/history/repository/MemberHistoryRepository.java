package com.ssafy.brAIn.history.repository;

import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberHistoryRepository extends JpaRepository<MemberHistory, Integer> {
    MemberHistory findById(MemberHistoryId memberHistoryIdId);
}
