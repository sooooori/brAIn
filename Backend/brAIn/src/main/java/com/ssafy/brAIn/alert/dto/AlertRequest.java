package com.ssafy.brAIn.alert.dto;

import com.ssafy.brAIn.alert.entity.Alert;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor // 기본 생성자 추가
@Getter
@AllArgsConstructor
public class AlertRequest {
    private Integer invitedMemberId;
    private Integer roomId;
    private Integer inviteMemberId;

    public Alert toAlert(Member invited, ConferenceRoom conferenceRoom, Member invite){
        return Alert.builder().invitedMember(invited).roomId(conferenceRoom).inviteMember(invite).build();
    }
}
