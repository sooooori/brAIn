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
public class MemberDto {

    private String email;
    private String password;
    private Role role;
    private Social social;
    private String name;
    private String photo;
    private Boolean locked;
    private Integer login_fail_count;

    public Member toMember() {
        return Member.builder()
                .email(email)
                .role(role)
                .social(social)
                .name(name)
                .photo(photo)
                .locked(locked)
                .login_fail_count(login_fail_count)
                .build();
    }
}
