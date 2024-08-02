package com.ssafy.brAIn.ai.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Message {

    private String assistantId;
    private String threadId;

    public Message(String assistantId, String threadId) {
        this.assistantId = assistantId;
        this.threadId = threadId;
    }
}
