package com.ssafy.brAIn.comment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoundPostItContent {

    private String content;

    public RoundPostItContent(String content) {
        this.content = content;
    }
}
