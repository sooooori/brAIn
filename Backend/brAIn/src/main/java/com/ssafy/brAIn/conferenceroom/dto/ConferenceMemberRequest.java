package com.ssafy.brAIn.conferenceroom.dto;

import com.ssafy.brAIn.history.dto.ConferenceToMemberResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ConferenceMemberRequest { // 회의록을 저장하는 메서드
    private int roomId;
    private String subject;
    private String conclusion;
    private Date totalTime;
    private List<ConferenceToMemberResponse> members;
}
