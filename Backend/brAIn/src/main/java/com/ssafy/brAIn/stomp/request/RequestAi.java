package com.ssafy.brAIn.stomp.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestAi {

    private int round;

    public RequestAi(int round) {
        this.round = round;
    }
}
