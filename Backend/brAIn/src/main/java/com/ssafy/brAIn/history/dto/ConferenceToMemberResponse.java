package com.ssafy.brAIn.history.dto;

import com.ssafy.brAIn.member.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ConferenceToMemberResponse { //회의에 참여한 사용자 정보
    private Integer memberId;
    private Role role;
    private String name;
}
