package com.ssafy.brAIn.member.dto;

import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.entity.Role;
import com.ssafy.brAIn.member.entity.Social;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MemberRequest {

    private String email;
    private String password;
    private String name;

    public Member toEntity(String encodedPassword) {
        return Member.builder()
                .email(this.email)
                .password(encodedPassword)
                .role(Role.USER)
                .social(Social.None)
                .name(this.name)
                .photo(null)
                .locked(true)
                .loginFailCount(0)
                .build();
    }
}
