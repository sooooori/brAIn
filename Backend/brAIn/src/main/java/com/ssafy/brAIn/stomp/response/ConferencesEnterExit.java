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
    private String nextUser;
    private boolean isAI;
    private boolean isLast;
    private List<String> users;

    public ConferencesEnterExit(MessageType type, String nickname, String nextUser, boolean isAI, boolean isLast,List<String> users) {
        this.messageType = type;
        this.nickname = nickname;
        this.nextUser = nextUser;
        this.isAI = isAI;
        this.isLast = isLast;
        this.users = users;
    }
}
