package com.ssafy.brAIn.stomp.response;


import com.ssafy.brAIn.stomp.dto.MessageType;
import com.ssafy.brAIn.stomp.dto.UserState;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResponseUserState {

    private UserState messagetype;
    private String curUser;

    public ResponseUserState(UserState type, String curUser) {
        this.messagetype = type;
        this.curUser = curUser;
    }
}
