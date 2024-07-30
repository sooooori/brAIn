package com.ssafy.brAIn.history.service;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.model.Status;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.util.RandomNicknameGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class MemberHistoryService {
    private final MemberHistoryRepository memberHistoryRepository;

    public MemberHistory save(MemberHistory memberHistory) {
        return memberHistoryRepository.save(memberHistory);
    }

    @Transactional
    public void createRoom(ConferenceRoom conferenceRoom, Member member) {
        memberHistoryRepository.save(MemberHistory.builder().member(member).conferenceRoom(conferenceRoom).id(new MemberHistoryId(member.getId(), conferenceRoom.getId())).role(Role.CHIEF).status(Status.COME).nickName(RandomNicknameGenerator.generateNickname()).orders(0).build());
    };
}
