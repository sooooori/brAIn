package com.ssafy.brAIn.history.guest.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.guest.entity.Guest;
import com.ssafy.brAIn.util.CommonUtils;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Embeddable
@Entity
public class GuestHistory {

    @EmbeddedId
    private GuestHistoryId id;

    @Column(name = "nickname")
    private String nickName;

    @Column(name = "order")
    private int order;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("guestId")
    @JoinColumn(name = "guest_id", insertable = false, updatable = false)
    private Guest guest;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roomId")
    @JoinColumn(name = "room_id", insertable = false, updatable = false)
    private ConferenceRoom conferenceRoom;

    @Builder
    public GuestHistory() {
        this.nickName = CommonUtils.generateRandomKoreanString();
    }

    // 기록 갱신 메서드
    public GuestHistory historyUpdate(){
        return this;
    }
}
