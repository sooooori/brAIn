package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NextIdea {

    private MessageType messageType;

    public NextIdea(MessageType messageType) {
        this.messageType = messageType;
    }
}
