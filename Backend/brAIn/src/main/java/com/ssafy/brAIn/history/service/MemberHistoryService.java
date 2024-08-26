package com.ssafy.brAIn.history.service;

import com.ssafy.brAIn.conferenceroom.dto.ConferenceMemberRequest;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.history.dto.ConferenceToMemberResponse;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.model.Status;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.member.service.MemberService;
import com.ssafy.brAIn.s3.S3Service;
import com.ssafy.brAIn.util.RandomNicknameGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class MemberHistoryService {

    private final MemberHistoryRepository memberHistoryRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final MemberService memberService;


    public List<MemberHistory> getHistoryByRoomId(int roomId) {
        return memberHistoryRepository.findByConferenceRoomId(roomId);
    }

    // 회원이 참여한 모든 회의 기록 보여주기 -> 사용자 이미지 파싱
    public List<ConferenceMemberRequest> getAllHistories(String email) {
        Optional<Member> optionalMember = memberRepository.findByEmail(email);
        if (optionalMember.isEmpty()) {
            throw new BadRequestException("Member not found");
        }
        Member member = optionalMember.get();
        List<MemberHistory> memberHistories = memberHistoryRepository.findByMemberId(member.getId());

        return memberHistories.stream()
                .map(memberHistory -> {
                    ConferenceRoom conferenceRoom = memberHistory.getConferenceRoom();
                    List<ConferenceToMemberResponse> memberResponses = conferenceRoom.getMemberHistories().stream()
                            .map(history -> new ConferenceToMemberResponse(history.getMember().getId(), history.getMember().getRole(), history.getMember().getName()))
                            .collect(Collectors.toList());

                    return new ConferenceMemberRequest(
                            conferenceRoom.getId(),
                            conferenceRoom.getSubject(),
                            conferenceRoom.getConclusion(),
// endTime 생기면 추후 주석 해제하고, getStartTime 지우기(endTime없어서 현재 에러남)
//                            getTimeDifference(conferenceRoom.getStartTime(), conferenceRoom.getEndTime()),
                            conferenceRoom.getStartTime(),
                            memberResponses
                    );
                })
                .collect(Collectors.toList());
    }

    //회의 번호 별 회원이 참여한 회의 기록 보여주기
    public ConferenceMemberRequest getHistoryDetails(String email, int conferenceId) {
        Optional<Member> optionalMember = memberRepository.findByEmail(email);
        if (optionalMember.isEmpty()) {
            throw new BadRequestException("Member not found");
        }

        Member member = optionalMember.get();
        Optional<MemberHistory> historyOptional = memberHistoryRepository.findByMemberIdAndConferenceRoomId(member.getId(), conferenceId);
        if (historyOptional.isEmpty()) {
            throw new BadRequestException("Member history not found");
        }

        MemberHistory memberHistory = historyOptional.get();
        ConferenceRoom conferenceRoom = memberHistory.getConferenceRoom();
        List<ConferenceToMemberResponse> memberResponses = conferenceRoom.getMemberHistories().stream()
                .map(history -> new ConferenceToMemberResponse(history.getMember().getId(), history.getMember().getRole(), history.getMember().getName()))
                .collect(Collectors.toList());

        return new ConferenceMemberRequest(
                conferenceRoom.getId(),
                conferenceRoom.getSubject(),
                conferenceRoom.getConclusion(),
//                getTimeDifference(conferenceRoom.getStartTime(), conferenceRoom.getEndTime()),
                conferenceRoom.getStartTime(),
                memberResponses
        );
    }

    // 시간 차이 계산 메서드
    private Date getTimeDifference(Date startTime, Date endTime) {
        long differenceInMillis = endTime.getTime() - startTime.getTime();
        return new Date(differenceInMillis);
    }

    @Transactional
    public void createRoom(ConferenceRoom conferenceRoom, Member member) {
        memberHistoryRepository.save(MemberHistory.builder().member(member).conferenceRoom(conferenceRoom).id(new MemberHistoryId(member.getId(), conferenceRoom.getId())).role(Role.CHIEF).status(Status.COME).nickName(RandomNicknameGenerator.generateNickname()).orders(0).build());
    };

    @Transactional
    public void joinRoom(ConferenceRoom conferenceRoom, Member member) {
        memberHistoryRepository.save(MemberHistory.builder().member(member).conferenceRoom(conferenceRoom).id(new MemberHistoryId(member.getId(), conferenceRoom.getId())).role(Role.MEMBER).status(Status.COME).nickName(RandomNicknameGenerator.generateNickname()).orders(0).build());
    };

    // 닉네임에 매칭된 프로필 이미지 URL 가져오기
    public String getProfileImageUrlForNickname(String nickname) {

        return s3Service.getProfileImageUrl(nickname);
    }

    public String getNicknameByEmail(String email,Integer roomId){
        Member member=memberService.findByEmail(email).get();

        MemberHistoryId memberHistoryId=new MemberHistoryId(member.getId(),roomId);
        return memberHistoryRepository.findById(memberHistoryId).get().getNickName();
    }
}
