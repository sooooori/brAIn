package com.ssafy.brAIn.stomp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Round {

    private String type;
    private int round;

    public Round(String type, int round) {
        this.type = type;
        this.round = round;
    }
}
