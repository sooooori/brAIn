package com.ssafy.brAIn.stomp.response;


import com.ssafy.brAIn.stomp.dto.MessageType;
import com.ssafy.brAIn.stomp.dto.UserState;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResponseUserState {

    private UserState type;
    private String curUser;

    public ResponseUserState(UserState type, String curUser) {
        this.type = type;
        this.curUser = curUser;
    }
}
