package com.ssafy.brAIn.stomp.service;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.model.Status;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.history.service.MemberHistoryService;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.stomp.dto.UserState;
import com.ssafy.brAIn.stomp.request.RequestGroupPost;
import com.ssafy.brAIn.util.RedisUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class MessageService {

    private final RedisUtils redisUtils;


    private final MemberHistoryRepository memberHistoryRepository;
    private final MemberHistoryService memberHistoryService;
    private final MemberRepository memberRepository;
    private final ConferenceRoomRepository conferenceRoomRepository;

    public MessageService(RedisUtils redisUtils,
                          MemberRepository memberRepository,
                          MemberHistoryRepository memberHistoryRepository,
                          ConferenceRoomRepository conferenceRoomRepository,
                          MemberHistoryService memberHistoryService) {
        this.redisUtils = redisUtils;
        this.memberHistoryRepository = memberHistoryRepository;
        this.memberRepository = memberRepository;
        this.conferenceRoomRepository=conferenceRoomRepository;
        this.memberHistoryService = memberHistoryService;
    }

    public void sendPost(Integer roomId, RequestGroupPost groupPost) {

        int round= groupPost.getRound();
        String content=groupPost.getContent();
        String key = roomId + ":" + round;
        redisUtils.setData(key,content,3600L);
    }

    
    //현재 유저가 마지막 순서인지 확인하는 메서드(테스트 완)
    public boolean isLastOrder(Integer roomId, String nickname) {
        Double order=redisUtils.getScoreFromSortedSet(roomId+":order:cur",nickname);
        int lastOrder=redisUtils.getSortedSet(roomId+":order:cur").size()-1;
        if (order == lastOrder) {
            return true;
        }
        return false;
    }

    //유저의 2/3가 패스하면 종료되야 함.
    public boolean isStep1EndCondition(Integer roomId) {
        AtomicInteger count= new AtomicInteger();

        List<String> nicknames=redisUtils.getSortedSet(roomId+":order:cur")
                .stream()
                .map(Object::toString)
                .toList();

        int len=nicknames.size();

        nicknames.forEach((nickname)->{
            if(redisUtils.getData(roomId+":"+nickname).equals("PASS")){
                count.getAndIncrement();
            }
        });

        return count.get() > len * (2.0 / 3.0);

    }

    //삭제예정
    //멤버가 대기방 입장 시, 레디스에 저장(테스트 완)
    public void enterWaitingRoom(Integer roomId,String email) {

        String key=roomId + ":" + "email";
        redisUtils.setData(key,email,3600L);
    }

    //멤버가 대기방에서 나갔을 때, 레디스에 저장(테스트 완)
    public void exitWaitingRoom(Integer roomId,String nickname) {

        redisUtils.setDataInSet(roomId+":out",nickname,7200L);
        //redisUtils.removeValueFromSortedSet(roomId+"order",nickname);
    }

    //멤버가 회의 중 나갔을 때 history 테이블 업데이트(테스트 완)
    @Transactional
    public void historyUpdate(Integer roomId,String email) {
        Optional<Member> member=memberRepository.findByEmail(email);
        if(member.isEmpty())return;

        //DB업데이트
        MemberHistoryId memberHistoryId=new MemberHistoryId(member.get().getId(),roomId);
        MemberHistory memberHistory= memberHistoryRepository.findById(memberHistoryId).get();
        memberHistory.historyStateUpdate(Status.OUT);
        memberHistoryRepository.save(memberHistory);

        //redis에 나간유저를 저장해놓자.
        redisUtils.setDataInSet(roomId+":out",memberHistory.getNickName(),7200L);

        //order에서는 삭제
        //redisUtils.removeValueFromSortedSet(roomId+":order",memberHistory.getNickName());


    }

    //다음 단계로 이동 시, 회의 룸 업데이트 해야함.(테스트 완료)
    @Transactional
    public void updateStep(Integer roomId, Step step) {
        Optional<ConferenceRoom> conferenceRoom=conferenceRoomRepository.findById(roomId);
        if(conferenceRoom.isEmpty())return;
        conferenceRoom.get().updateStep(step);
        conferenceRoomRepository.saveAndFlush(conferenceRoom.get());
        redisUtils.save(roomId+":curStep",step.toString());
    }

    //유저 상태 레디스에 임시 저장
    public void updateUserState(Integer roomId, String nickname,UserState userState) {
        String key=roomId + ":" + nickname;
        redisUtils.save(key,userState.toString());
    }

    //방장이 회의 시작 요청을 보내면 현재 멤버들을 닉네임으로 기록한다.(테스트 완료)
    public List<Object> startConferences(Integer roomId) {

        //현재 회의룸에 있는 모든 유저들을 가져온다.
        List<MemberHistory> memberHistories=memberHistoryService.getHistoryByRoomId(roomId);

        //인공지능의 history도 가져온다.

        //한번 섞어준다.
        Collections.shuffle(memberHistories);

        for(int i=0;i<memberHistories.size();i++){
            MemberHistory memberHistory=memberHistories.get(i);
            memberHistory.setOrder(i);
            memberHistoryRepository.save(memberHistory);

            redisUtils.setSortedSet(roomId+":"+"order",i,memberHistory.getNickName());
            if(memberHistory.getStatus().equals(Status.OUT))continue;
            redisUtils.setSortedSet(roomId+":"+"order:cur",i,memberHistory.getNickName());

        }
        return redisUtils.getSortedSet(roomId+":order");
    }

//    public MemberHistory makeAiHistory(Integer roomId) {
//        redisUtils.getData()
//    }




    //현재 유저의 다음 순서의 사람을 가져온다.(닉네임)
    public String NextOrder(Integer roomId,String curUser) {
        String key=roomId + ":order" ;
        int curOrder= redisUtils.getScoreFromSortedSet(key,curUser).intValue();

        int totalUser=redisUtils.getSortedSet(key).size();
        int nextOrder=(curOrder+1)%totalUser;
        while (true) {
            if(!redisUtils.isValueInSet(roomId+":out",redisUtils.getUserFromSortedSet(key,nextOrder)))break;
            nextOrder++;
            nextOrder%=totalUser;
        }
        return redisUtils.getUserFromSortedSet(key,nextOrder);
    }

    //현재 제출순서가 된 유저를 업데이트한다.
    public void updateCurOrder(Integer roomId,String curUser) {
        String key=roomId+":curOrder";
        //System.out.println("nextUser"+curUser);
        redisUtils.updateValue(key,curUser);
    }

    //현재 차례의 유저를 반환한다.
    public String getCurUser(Integer roomId) {
        String key=roomId + ":curOrder";
        return redisUtils.getData(key);
    }

    //
    public boolean isPrevUser(Integer roomId,String curUser,String compareUser) {
        int cur = redisUtils.getScoreFromSortedSet(roomId + ":order", curUser).intValue();
        int compare = redisUtils.getScoreFromSortedSet(roomId + ":order", compareUser).intValue();


        if (compare < cur) {
            return true;
        }
        return false;
    }


    public void initUserState(Integer roomId) {
        String key=roomId + ":order";
        redisUtils.getSortedSet(key)
//                .filter((user)->redisUtils.isKeyExists(roomId+":"+user))
                .forEach((user)->redisUtils.save(roomId+":"+user,UserState.NONE.toString()));

        String FirstUser = redisUtils.getUserFromSortedSet(roomId + ":order:cur", 0);
        redisUtils.save(roomId+":curOrder",FirstUser);
    }

}
