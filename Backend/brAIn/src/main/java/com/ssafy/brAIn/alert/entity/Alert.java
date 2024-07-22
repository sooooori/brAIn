package com.ssafy.brAIn.alert.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.member.entity.Member;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_member_id")
    private Member invitedMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private ConferenceRoom roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invite_member_id")
    private Member inviteMember;

    @Column(name = "checked")
    private boolean checked;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    @Builder
    public Alert(Member invitedMember, ConferenceRoom roomId, Member inviteMember){
        this.invitedMember = invitedMember;
        this.roomId = roomId;
        this.inviteMember = inviteMember;
        this.checked = false;
        this.createdAt = new Date();
    }
}
