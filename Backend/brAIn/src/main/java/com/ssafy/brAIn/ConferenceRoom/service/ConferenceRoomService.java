package com.ssafy.brAIn.ConferenceRoom.service;

import com.ssafy.brAIn.ConferenceRoom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.ConferenceRoom.entity.ConferenceRoom;
import com.ssafy.brAIn.ConferenceRoom.repository.ConferenceRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor // final이 붙거나 @NotNull이 붙은 필드의 생성자 추가
@Service // 해당 클래스를 빈으로 서블릿 컨테이너에 등록
public class ConferenceRoomService {
    private final ConferenceRoomRepository conferenceRoomRepository;

    public ConferenceRoom save(ConferenceRoomRequest conferenceRoomRequest) {
        return conferenceRoomRepository.save(conferenceRoomRequest.toConferenceRoom());
    }
}