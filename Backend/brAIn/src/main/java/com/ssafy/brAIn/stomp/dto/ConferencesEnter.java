package com.ssafy.brAIn.stomp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConferencesEnter {

    private String type;
    private String nickname;

    public ConferencesEnter(String type, String nickname) {
        this.type = type;
        this.nickname = nickname;
    }
}
