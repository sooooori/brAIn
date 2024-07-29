package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseGroupPost {

    private MessageType type;
    private int round;
    private String content;

    public ResponseGroupPost(MessageType type, int round, String content) {
        this.type = type;
        this.round = round;
        this.content = content;
    }

}
