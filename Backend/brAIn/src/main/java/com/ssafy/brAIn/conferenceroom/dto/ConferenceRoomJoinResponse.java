package com.ssafy.brAIn.conferenceroom.dto;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.history.dto.HistoryToMemberResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
@Getter
public class ConferenceRoomJoinResponse {
//        "subject": "회의 주제",
//                "startTime": "2023-07-19T10:00:00Z",
//                "inviteCode": "542221",
//                "threatId": 1,
//                "hostedId": 2,
//                "step" : "STEP_1",
//                "round" : 3,

//    private String subject;
//    private Date startTime;
//    private Integer hostedId;
//    private Step step;
//    private Integer round;
    private String subject;
    private Date startTime;
    private String inviteCode;
    private Step step;
    private int round;
    private List<HistoryToMemberResponse> children;

    public ConferenceRoomJoinResponse(ConferenceRoom conferenceRoom) {
        this.subject = conferenceRoom.getSubject();
        this.startTime = conferenceRoom.getStartTime();
        this.inviteCode = conferenceRoom.getInviteCode();
        this.step = conferenceRoom.getStep();
        this.round = conferenceRoom.getRound();
        this.children = new ArrayList<>();
    }
}
