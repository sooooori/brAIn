package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EndMessage {

    private MessageType messageType;

    public EndMessage(MessageType type) {
        this.messageType = type;
    }
}
