package com.ssafy.brAIn.auth.oauth.kakao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KakaoTokens {

    private String accessToken;
    private String refreshToken;
    private String grantType;
    private Long expiresIn;

}
