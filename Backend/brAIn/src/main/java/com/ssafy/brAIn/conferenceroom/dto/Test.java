package com.ssafy.brAIn.conferenceroom.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Test {

    private String category;
    private String username;
    private String role;
    private String nickname;
    private String roomId;


    public Test(String category, String username, String role, String nickname, String roomId) {
        this.category = category;
        this.username = username;
        this.role = role;
        this.nickname = nickname;
        this.roomId = roomId;

    }
}
