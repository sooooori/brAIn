package com.ssafy.brAIn.history.member.service;

import com.ssafy.brAIn.history.member.entity.MemberHistory;
import com.ssafy.brAIn.history.member.repository.MemberHistoryRepository;
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
