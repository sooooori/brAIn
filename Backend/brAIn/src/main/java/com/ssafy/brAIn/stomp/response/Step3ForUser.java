package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Step3ForUser {

    private MessageType messageType;
    private List<String> step3ForUser;

    public Step3ForUser(MessageType messageType, List<String> step3ForUser) {
        this.messageType = messageType;
        this.step3ForUser = step3ForUser;

    }
}
