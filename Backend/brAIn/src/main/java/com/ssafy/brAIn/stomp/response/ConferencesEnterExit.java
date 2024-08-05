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

    private MessageType type;
    private String nickname;
    private List<String> users;

    public ConferencesEnterExit(MessageType type, String nickname, List<String> users) {
        this.type = type;
        this.nickname = nickname;
        this.users = users;
    }
}
