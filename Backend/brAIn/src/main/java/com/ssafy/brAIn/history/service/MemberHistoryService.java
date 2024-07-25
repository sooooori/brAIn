package com.ssafy.brAIn.history.service;

import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MemberHistoryService {
    private final MemberHistoryRepository memberHistoryRepository;

    public MemberHistory save(MemberHistory memberHistory) {
        return memberHistoryRepository.save(memberHistory);
    }
}
