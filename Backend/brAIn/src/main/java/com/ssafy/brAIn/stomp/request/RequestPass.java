package com.ssafy.brAIn.stomp.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestPass {

    private int curRound;

    public RequestPass(int curRound) {
        this.curRound = curRound;
    }
}
