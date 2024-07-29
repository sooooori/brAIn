package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConferencesEnterExit {

    private MessageType type;
    private String nickname;

    public ConferencesEnterExit(MessageType type, String nickname) {
        this.type = type;
        this.nickname = nickname;
    }
}
