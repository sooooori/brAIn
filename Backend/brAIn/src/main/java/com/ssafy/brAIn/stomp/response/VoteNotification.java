package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VoteNotification {

    private MessageType messageType;

    public VoteNotification(MessageType type) {
        this.messageType = type;
    }
}
