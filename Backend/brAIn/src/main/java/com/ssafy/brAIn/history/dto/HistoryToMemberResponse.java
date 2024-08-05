package com.ssafy.brAIn.history.dto;

import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.model.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 추가
@Getter
public class HistoryToMemberResponse {
    private Integer memberId;
    private Role role;
    private String nick;
    private Status status;

    // 생성자를 이용해 엔티티를 DTO로 변환하는 메서드
    public static HistoryToMemberResponse fromEntity(MemberHistory history) {
        return new HistoryToMemberResponse(
                history.getId().getMemberId(),
                history.getRole(),
                history.getNickName(),
                history.getStatus()
        );
    }
}
