package com.ssafy.brAIn.stomp.response;


import com.ssafy.brAIn.stomp.dto.MessageType;
import com.ssafy.brAIn.stomp.dto.UserState;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResponseUserState {

    private UserState userState;
    private String nickname;

    public ResponseUserState(UserState userState, String nickname) {
        this.userState = userState;
        this.nickname = nickname;
    }
}
