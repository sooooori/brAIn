package com.ssafy.brAIn.ConferenceRoom.dto;

import com.ssafy.brAIn.ConferenceRoom.entity.ConferenceRoom;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
@Getter
public class ConferenceRoomRequest {
    private String subject;
    private int maxParticipate;
    private int time;

    public ConferenceRoom toConferenceRoom() {
        return ConferenceRoom.builder().subject(subject).maxParticipate(maxParticipate).time(time).build();
    }
}
