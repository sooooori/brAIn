package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class StartMessage {

    private MessageType messageType;
    private List<String> users;
    private String aiNickname;

    public StartMessage(MessageType messageType, List<String> users, String aiNickname) {
        this.messageType = messageType;
        this.users = users;
        this.aiNickname = aiNickname;
    }
}
