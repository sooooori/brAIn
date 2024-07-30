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
    private String sender;
    private int curRound;
    private int nextRound;
    private String content;

    public ResponseGroupPost(MessageType type, String sender,int curRound, int nextRound, String content) {
        this.type = type;
        this.sender = sender;
        this.curRound = curRound;
        this.nextRound = nextRound;
        this.content = content;
    }

}
