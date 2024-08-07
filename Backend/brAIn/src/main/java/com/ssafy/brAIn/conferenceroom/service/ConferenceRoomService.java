package com.ssafy.brAIn.conferenceroom.service;

import com.ssafy.brAIn.ai.response.AIAssistant;
import com.ssafy.brAIn.ai.service.AIService;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceMemberRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.dto.ConferenceToMemberResponse;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

@RequiredArgsConstructor // final이 붙거나 @NotNull이 붙은 필드의 생성자 추가
@Service // 해당 클래스를 빈으로 서블릿 컨테이너에 등록
public class ConferenceRoomService {

    private final ConferenceRoomRepository conferenceRoomRepository;

    @Autowired
    private AIService aiService;

    @Transactional
    public ConferenceRoom save(ConferenceRoom conferenceRoom) {
        //Map<String, Object> res = OpenAiService.sendPostRequest(conferenceRoom.getSubject());
        AIAssistant assistant= aiService.makeAIAssistant(conferenceRoom.getSubject());
        System.out.println(assistant.getAssistantId());
        System.out.println(assistant.getThreadId());
        //System.out.println(res.toString());
        conferenceRoom.updateAi(assistant.getAssistantId(), assistant.getThreadId());
        return conferenceRoomRepository.save(conferenceRoom);
    }

    public ConferenceRoom findByInviteCode(String inviteCode) {
       return conferenceRoomRepository.findByInviteCode(inviteCode).orElse(null);
    }

    public ConferenceRoom findBySecureId(String secureId) {
        return conferenceRoomRepository.findBySecureId(secureId).orElse(null);
    }

    public ConferenceRoom findByRoomId(String roomId) {
        return conferenceRoomRepository.findById(Integer.parseInt(roomId)).orElse(null);
    }


    @Transactional
    public ConferenceMemberRequest saveConferenceHistory(ConferenceMemberRequest conferenceSaveRequest) {
        ConferenceRoom conferenceRoom = conferenceRoomRepository.findById(conferenceSaveRequest.getRoomId())
                .orElseThrow(() -> new RuntimeException("Conference Room not found"));

        // 회의 종료 시간과 시작 시간의 차이 계산
        Date totalTime = getTimeDifference(conferenceRoom.getStartTime(), new Date());

        //회의록 저장
        conferenceRoom.updateConferenceDetails(
                conferenceSaveRequest.getConclusion(),
                new Date()
        );

        // 회의 종료 처리
        conferenceRoom.updateStep(Step.STEP_5);
        ConferenceRoom updated = conferenceRoomRepository.save(conferenceRoom);

        //회원 정보
        List<ConferenceToMemberResponse> members = conferenceSaveRequest.getMembers();
        return new ConferenceMemberRequest(
                updated.getId(),
                updated.getSubject(),
                updated.getConclusion(),
                totalTime,
                members
        );
    }

    //시간 차 계산
    public static Date getTimeDifference(Date startDate, Date endDate) {
        long diffInMillis = endDate.getTime() - startDate.getTime();
        return new Date(diffInMillis - TimeZone.getDefault().getRawOffset());
    }

    // 회의룸 재설정
    public void updateConferenceRoom(Integer roomId, String subject, Date startTime) {
        ConferenceRoom conferenceRoom = conferenceRoomRepository.findById(roomId)
                .orElse(null);

        if (conferenceRoom == null) {
            throw new RuntimeException("Conference Room not found");
        } else {
            conferenceRoom.updateConferenceRoom(subject, startTime);
        }

        conferenceRoomRepository.save(conferenceRoom);
    }
}