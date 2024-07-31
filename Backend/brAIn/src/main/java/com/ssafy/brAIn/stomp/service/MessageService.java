package com.ssafy.brAIn.stomp.service;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.entity.MemberHistoryId;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.model.Status;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.stomp.dto.UserState;
import com.ssafy.brAIn.stomp.request.RequestGroupPost;
import com.ssafy.brAIn.stomp.response.ResponseGroupPost;
import com.ssafy.brAIn.util.RedisUtils;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    
    //현재 유저가 마지막 순서인지 확인하는 메서드(테스트 완)
    public boolean isLastOrder(Integer roomId, String nickname) {
        System.out.println(nickname);
        Double order=redisUtils.getScoreFromSortedSet(roomId+":order",nickname);
        int lastOrder=redisUtils.getSortedSet(roomId+":order").size()-1;
        if (order == lastOrder) {
            return true;
        }
        return false;
    }

    //멤버가 대기방 입장 시, 레디스에 저장(테스트 완)
    public void enterWaitingRoom(Integer roomId,String email) {

        String key=roomId + ":" + "email";
        redisUtils.setData(key,email,3600L);
    }

    //멤버가 대기방에서 나갔을 때, 레디스에서 삭제(테스트 완)
    public void exitWaitingRoom(Integer roomId,String username) {
        String key=roomId + ":" + "email";
        redisUtils.removeDataInList(key,username);
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

        //redis에 나간유저를 저장해놓자.
        redisUtils.setDataInSet(roomId+":out",memberHistory.getNickName(),7200L);

    }

    //다음 단계로 이동 시, 회의 룸 업데이트 해야함.(테스트 완료)
    @Transactional
    public void updateStep(Integer roomId, Step step) {
        Optional<ConferenceRoom> conferenceRoom=conferenceRoomRepository.findById(roomId);
        if(conferenceRoom.isEmpty())return;
        conferenceRoom.get().updateStep(step);
        redisUtils.save(roomId+":curStep",step.toString());
    }

    //유저 상태 레디스에 임시 저장
    public void updateUserState(Integer roomId, String nickname,UserState userState) {
        String key=roomId + ":" + nickname;
        redisUtils.save(key,userState.toString());
    }

    //방장이 회의 시작 요청을 보내면 현재 멤버들을 닉네임으로 기록한다.
    public List<Object> startConferences(Integer roomId,String chiefEmail) {
        String key=roomId + ":" + "email";
        List<String> users=redisUtils.getListFromKey(key)
                .stream()
                .map(Object::toString)
                .toList();

        List<Integer> order=makeRandomList(users.size());
        List<String> nicknames = getNicknames(roomId);

        for(int i=0;i<users.size();i++){
            String userEmail = users.get(i);
            Role role = userEmail.equals(chiefEmail) ? Role.CHIEF : Role.MEMBER;

            MemberHistory memberHistory=MemberHistory.builder()
                    .id(new MemberHistoryId(memberRepository.findByEmail(users.get(i)).get().getId(),roomId))
                    .role(role)
                    .status(Status.COME)
                    .orders(order.get(i))
                    .nickName(nicknames.get(i))
                    .member(memberRepository.findByEmail(users.get(i)).get())
                    .conferenceRoom(conferenceRoomRepository.getReferenceById(roomId))
                    .build();

            //레디스에 유저들의 순서를 닉네임으로 저장
            redisUtils.setSortedSet(roomId+":"+"order", order.get(i),nicknames.get(i) );
            memberHistoryRepository.save(memberHistory);
        }

        return redisUtils.getSortedSet(roomId+":order");
    }


    //닉네임 목록을 가져옴
    private List<String> getNicknames(Integer roomId) {

        List<String> nicknames = new ArrayList<>(redisUtils.getListFromKey(roomId + ":nicknames").stream()
                .map(Object::toString).toList());

        //랜덤으로 부여하기 위해 한번 섞어준다.
        Collections.shuffle(nicknames);

        return nicknames;
    }

    //유저들의 순서를 정하기 위한 함수
    private List<Integer> makeRandomList(int size) {
        List<Integer> order=new ArrayList<>();
        for (int i = 0; i < size; i++) {
            order.add(i);
        }

        Collections.shuffle(order);
        return order;

    }

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
        redisUtils.updateValue(key,curUser);
    }

    //현재 차례의 유저를 반환한다.
    public String getCurUser(Integer roomId) {
        String key=roomId + ":curOrder";
        return redisUtils.getData(key);
    }





}
