package com.ssafy.brAIn.history.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode
public class MemberHistoryId implements Serializable {

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "room_id")
    private Long roomId;
}
