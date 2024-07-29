package com.ssafy.brAIn.stomp.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestGroupPost {


    private int round;
    private String content;

    public RequestGroupPost(int round, String content) {
        this.round = round;
        this.content = content;
    }

}
