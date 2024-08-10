package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import com.ssafy.brAIn.stomp.dto.UserState;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseRoundState {

    private UserState messageType;
    private String curUser;
    private String nextUser;

    public ResponseRoundState(UserState type, String curUser, String nextUser) {
        this.messageType = type;
        this.curUser = curUser;
        this.nextUser = nextUser;
    }
}
