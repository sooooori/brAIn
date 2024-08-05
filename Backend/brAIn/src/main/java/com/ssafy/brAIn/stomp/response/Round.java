package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Round {

    private MessageType type;
    private int round;

    public Round(MessageType type, int round) {
        this.type = type;
        this.round = round;
    }
}
