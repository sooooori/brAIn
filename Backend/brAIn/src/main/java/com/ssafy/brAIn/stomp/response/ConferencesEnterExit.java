package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ConferencesEnterExit {

    private MessageType messageType;
    private String nickname;
    private List<String> users;

    public ConferencesEnterExit(MessageType type, String nickname, List<String> users) {
        this.messageType = type;
        this.nickname = nickname;
        this.users = users;
    }
}
