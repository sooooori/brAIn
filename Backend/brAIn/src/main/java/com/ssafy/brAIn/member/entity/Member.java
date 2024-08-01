package com.ssafy.brAIn.member.entity;

import com.ssafy.brAIn.history.entity.MemberHistory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "social")
    private Social social;

    @Column(name = "name")
    private String name;

    @Column(name = "photo")
    private String photo;

    @Column(name = "locked")
    private Boolean locked;

    @Column(name = "loginFailCount")
    private Integer loginFailCount;

    @Column(name = "refresh_token")
    private String refreshToken;

    @OneToMany(mappedBy = "member")
    private List<MemberHistory> memberHistories;

    @Builder
    public Member(String email, String password, Role role, Social social, String name, String photo, Boolean locked, Integer loginFailCount, String refreshToken) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.social = social;
        this.name = name;
        this.photo = photo;
        this.locked = locked;
        this.loginFailCount = loginFailCount;
        this.refreshToken = refreshToken;
    }

    // refreshTOken 업데이트
    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // UserDetials 재정의

    // 권한 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    // 이메일 반환
    @Override
    public String getUsername() {
        return email;
    }

    // 계정 잠김여부 반환
    @Override
    public boolean isAccountNonLocked() {
        return locked;
    }
}
