package com.ssafy.brAIn.stomp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WaitingRoomEnter {

    private String type;

    public WaitingRoomEnter(String type) {
        this.type = type;
    }
}
