package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Step {

    private MessageType type;
    private int curStep;

    public Step(MessageType type, int curStep) {
        this.type = type;
        this.curStep = curStep;
    }
}
