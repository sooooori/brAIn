package com.ssafy.brAIn.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PasswordRequest {
    private String email;
    private String oldPassword;
    private String newPassword;
}
