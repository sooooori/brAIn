package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseStep {

    private MessageType type;
    private Step curStep;

    public ResponseStep(MessageType type, Step curStep) {
        this.type = type;
        this.curStep = curStep;
    }
}
