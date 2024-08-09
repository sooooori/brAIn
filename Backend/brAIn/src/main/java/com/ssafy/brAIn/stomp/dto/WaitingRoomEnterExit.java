package com.ssafy.brAIn.stomp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WaitingRoomEnterExit {

    private MessageType messageType;

    public WaitingRoomEnterExit(MessageType type) {
        this.messageType = type;
    }
}
