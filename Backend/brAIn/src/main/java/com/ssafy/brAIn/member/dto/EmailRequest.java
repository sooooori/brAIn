package com.ssafy.brAIn.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EmailRequest {
    private String email;
    private String code;
}
