package com.ssafy.brAIn.stomp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GroupPost {

    private String type;
    private int round;
    private String content;

    public GroupPost(String type, int round, String content) {
        this.type = type;
        this.round = round;
        this.content = content;
    }

}
