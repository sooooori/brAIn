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
public class MemberResponse {

    private String email;
    private String name;
    private Role role;
    private Social social;
    private String photo;

    public static MemberResponse fromEntity(Member member) {
        return new MemberResponse(
                member.getEmail(),
                member.getName(),
                member.getRole(),
                member.getSocial(),
                member.getPhoto()
        );
    }
}
