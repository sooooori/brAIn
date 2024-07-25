package com.ssafy.brAIn.stomp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConferencesEnterExit {

    private String type;
    private String nickname;

    public ConferencesEnterExit(String type, String nickname) {
        this.type = type;
        this.nickname = nickname;
    }
}
