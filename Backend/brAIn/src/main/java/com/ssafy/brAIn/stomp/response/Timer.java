package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Timer {

    private MessageType messageType;
    private Long time;

    public Timer(MessageType messageType, Long time) {
        this.messageType = messageType;
        this.time = time;
    }
}
