package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResponsePassAndEnd {

    private MessageType messageType;
    private String curUser;

    public ResponsePassAndEnd(MessageType messageType, String curUser) {
        this.messageType = messageType;
        this.curUser = curUser;
    }
}
