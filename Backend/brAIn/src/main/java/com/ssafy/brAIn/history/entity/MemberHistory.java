package com.ssafy.brAIn.history.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.history.model.Role;
import com.ssafy.brAIn.history.model.Status;
import com.ssafy.brAIn.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberHistory implements UserDetails {

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

    @Column(name = "orders")
    private int orders;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("memberId")
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roomId")
    @JoinColumn(name = "room_id")
    private ConferenceRoom conferenceRoom;

    @Builder
    public MemberHistory(MemberHistoryId id, Role role, Status status, String nickName, int orders, Member member, ConferenceRoom conferenceRoom) {
        this.id = id;
        this.role = role;
        this.status = status;
//        this.nickName = CommonUtils.generateRandomKoreanString(); //6글자 랜덤 닉네임
        this.orders = orders;
        this.nickName = nickName;
        this.member = member;
        this.conferenceRoom = conferenceRoom;
    }



    //멤버가 회의를 도중에 나가거나 다시 들어왔을 때 history 업데이트
    public void historyStateUpdate(Status status) {
        this.status = status;
    }

    public MemberHistory setOrder(Integer order) {
        this.orders = order;
        return this;
    }

    // 기록 갱신 메서드
    public MemberHistory historyUpdate(){
        return this;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return nickName;
    }
}