package com.ssafy.brAIn.history.member.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.history.member.model.Role;
import com.ssafy.brAIn.history.member.model.Status;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.util.CommonUtils;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberHistory {

    @EmbeddedId
    private MemberHistoryId id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "nickname")
    private String nickName;

    @Column(name = "order")
    private int order;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("memberId")
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roomId")
    @JoinColumn(name = "room_id")
    private ConferenceRoom conferenceRoom;

    @Builder
    public MemberHistory(MemberHistoryId id, Role role, Status status, Member member, ConferenceRoom conferenceRoom) {
        this.id = id;
        this.role = role;
        this.status = status;
        this.nickName = CommonUtils.generateRandomKoreanString(); //6글자 랜덤 닉네임
        this.member = member;
        this.conferenceRoom = conferenceRoom;
    }

    // 기록 갱신 메서드
    public MemberHistory historyUpdate(){
        return this;
    }
}