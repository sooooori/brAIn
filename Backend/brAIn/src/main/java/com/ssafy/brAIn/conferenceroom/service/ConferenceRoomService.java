package com.ssafy.brAIn.conferenceroom.service;

import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Objects;

@RequiredArgsConstructor // final이 붙거나 @NotNull이 붙은 필드의 생성자 추가
@Service // 해당 클래스를 빈으로 서블릿 컨테이너에 등록
public class ConferenceRoomService {

    private final ConferenceRoomRepository conferenceRoomRepository;

    @Transactional
    public ConferenceRoom save(ConferenceRoom conferenceRoom) {
        Map<String, Object> res = OpenAiService.sendPostRequest(conferenceRoom.getSubject());
        System.out.println(res.toString());
        conferenceRoom.updateAi(res.get("assistantId").toString(), res.get("threadId").toString());
        return conferenceRoomRepository.save(conferenceRoom);
    }

    public ConferenceRoom findByInviteCode(String inviteCode) {
       return conferenceRoomRepository.findByInviteCode(inviteCode).orElse(null);
    }
}