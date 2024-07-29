package com.ssafy.brAIn.conferenceroom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
@Getter
public class ConferenceRoomResponse {
//        "subject": "회의 주제",
//                "startTime": "2023-07-19T10:00:00Z",
//                "inviteCode": "542221",
//                "threatId": 1,
//                "hostedId": 2,
//                "step" : "STEP_1",
//                "round" : 3,

    private String subject;
}
