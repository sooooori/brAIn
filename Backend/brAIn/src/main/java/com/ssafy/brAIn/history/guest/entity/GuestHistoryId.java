package com.ssafy.brAIn.history.guest.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode
public class GuestHistoryId {

    @Id
    @Column(name = "guest_id")
    private int guestId;

    @Id
    @Column(name = "room_id")
    private int roomId;
}
