package com.ssafy.brAIn.member.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "social")
    private Social social;

    @Column(name = "member_name", nullable = false)
    private String name;

    @Column(name = "photo")
    private String photo;

    @Column(name = "locked")
    private Boolean locked;

    @Column(name = "loginCount")
    private Integer login_fail_count;

    @Builder
    public Member(String email, String password, Role role, Social social, String name, String photo, Boolean locked, Integer login_fail_count) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.social = social;
        this.name = name;
        this.photo = photo;
        this.locked = locked;
        this.login_fail_count = login_fail_count;
    }

    public Member update(Member member) {
        this.password = member.password;
        this.role = member.role;
        this.social = member.social;
        this.name = member.name;
        this.photo = member.photo;
        this.locked = member.locked;
        this.login_fail_count = member.login_fail_count;
        return this;
    }
}
