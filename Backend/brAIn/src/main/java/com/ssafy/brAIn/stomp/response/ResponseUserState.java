package com.ssafy.brAIn.stomp.response;


import com.ssafy.brAIn.stomp.dto.MessageType;
import com.ssafy.brAIn.stomp.dto.UserState;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResponseUserState {

    private UserState type;
    private String nickname;

    public ResponseUserState(UserState type, String nickname) {
        this.type = type;
        this.nickname = nickname;
    }
}
