package com.ssafy.brAIn.stomp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WaitingRoomEnterExit {

    private String type;

    public WaitingRoomEnterExit(String type) {
        this.type = type;
    }
}
