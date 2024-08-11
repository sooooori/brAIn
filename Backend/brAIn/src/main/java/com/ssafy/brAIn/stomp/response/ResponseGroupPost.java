package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseGroupPost {

    private MessageType messageType;
    private String sender;
    private String nextUser;
    private int curRound;
    private int nextRound;
    private String content;

    public ResponseGroupPost(MessageType type, String sender, String nextUser, int curRound, int nextRound, String content) {
        this.messageType = type;
        this.sender = sender;
        this.nextUser = nextUser;
        this.curRound = curRound;
        this.nextRound = nextRound;
        this.content = content;
    }

}
