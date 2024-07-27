package com.ssafy.brAIn.stomp.service;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.member.entity.MemberHistory;
import com.ssafy.brAIn.history.member.entity.MemberHistoryId;
import com.ssafy.brAIn.history.member.model.Status;
import com.ssafy.brAIn.history.member.repository.MemberHistoryRepository;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.stomp.dto.UserState;
import com.ssafy.brAIn.stomp.request.RequestGroupPost;
import com.ssafy.brAIn.stomp.response.ResponseGroupPost;
import com.ssafy.brAIn.util.RedisUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class MessageService {

    private final RedisUtils redisUtils;


    private final MemberHistoryRepository memberHistoryRepository;
    private final MemberRepository memberRepository;
    private final ConferenceRoomRepository conferenceRoomRepository;

    public MessageService(RedisUtils redisUtils,
                          MemberRepository memberRepository,
                          MemberHistoryRepository memberHistoryRepository,
                          ConferenceRoomRepository conferenceRoomRepository) {
        this.redisUtils = redisUtils;
        this.memberHistoryRepository = memberHistoryRepository;
        this.memberRepository = memberRepository;
        this.conferenceRoomRepository=conferenceRoomRepository;
    }

    public void sendPost(Integer roomId, RequestGroupPost groupPost) {

        int round= groupPost.getRound();
        String content=groupPost.getContent();
        String key = roomId + ":" + round;
        redisUtils.setData(key,content,3600L);
    }

    //멤버가 대기방 입장 시, 레디스에 저장
    public void enterWaitingRoom(Integer roomId,String username) {

        String key=roomId + ":" + "username";
        redisUtils.setData(key,username,3600L);
    }

    //멤버가 대기방에서 나갔을 때, 레디스에서 삭제
    public void exitWaitingRoom(Integer roomId,String username) {
        String key=roomId + ":" + "username";
        redisUtils.removeDataInList(key,username);
    }

    //멤버가 회의 중 나갔을 때 history 테이블 업데이트
    @Transactional
    public void historyUpdate(Integer roomId,String email) {
        Optional<Member> member=memberRepository.findByEmail(email);
        if(member.isEmpty())return;

        MemberHistoryId memberHistoryId=new MemberHistoryId(roomId,member.get().getId());
        MemberHistory memberHistory= memberHistoryRepository.findById(memberHistoryId);
        memberHistory.historyStateUpdate(Status.OUT);
    }

    //다음 단계로 이동 시, 회의 룸 업데이트 해야함.
    @Transactional
    public void updateStep(Integer RoomId, Step step) {
        Optional<ConferenceRoom> conferenceRoom=conferenceRoomRepository.findById(RoomId);
        if(conferenceRoom.isEmpty())return;
        conferenceRoom.get().updateStep(step.next());
    }

    //유저 상태 레디스에 임시 저장
    public void updateUserState(Integer RoomId, String nickname,UserState userState) {
        String key=RoomId + ":" + nickname;
        redisUtils.setData(key,userState.toString(),3600L);
    }








}
