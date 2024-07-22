package com.ssafy.brAIn.history.guest.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Id;
import lombok.*;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class GuestHistoryId {

    private Integer guestId;
    private Integer roomId;
}
