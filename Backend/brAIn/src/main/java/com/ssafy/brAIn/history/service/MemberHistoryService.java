package com.ssafy.brAIn.history.service;

import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MemberHistoryService {
    private final MemberHistoryRepository memberHistoryRepository;

    // 사용자 ID에 해당하는 모든 회의 조회
    public List<MemberHistory> getAllHistories(int memberId) {
        return memberHistoryRepository.findByMemberId(memberId);
    }

    // 사용자 ID에 해당하는 개별 회의 열람
    public Optional<MemberHistory> getHistoryDetails(MemberHistoryId memberHistoryId) {
        return memberHistoryRepository.findById(memberHistoryId);
    }

    // 회의 기록
    public MemberHistory saveHistory(MemberHistory memberHistory) {
        return memberHistoryRepository.save(memberHistory);
    }
}
