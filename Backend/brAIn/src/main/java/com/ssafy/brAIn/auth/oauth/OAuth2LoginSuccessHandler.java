package com.ssafy.brAIn.auth.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.entity.Role;
import com.ssafy.brAIn.member.entity.Social;
import com.ssafy.brAIn.member.repository.MemberRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberRepository memberRepository;
    // JSON 변환을 위한 ObjectMapper
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // OAuth2User 객체에서 사용자 정보를 가져옴
        DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();

        // 사용자 정보에서 이메일과 이름을 추출
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        // 데이터베이스에서 사용자 정보를 조회하거나 없으면 새로 생성
        Member member = memberRepository.findByEmail(email).orElseGet(() ->
                memberRepository.save(Member.builder()
                        .email(email)
                        .name(name)
                        .role(Role.USER)
                        .social(Social.Google)
                        .locked(true)
                        .loginFailCount(0)
                        .photo("null")
                        .password("googleLoginUser")
                        .build())
        );

        // JWT 토큰 생성
        String accessToken = JwtUtil.createAccessToken(authentication);
        String refreshToken = JwtUtil.createRefreshToken(authentication);

        // 사용자 DB에 RefreshToken 저장
        member.updateRefreshToken(refreshToken);
        memberRepository.save(member);

        // RefreshToken 쿠키에 저장
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setMaxAge(1209600); // 14일 설정
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        // 리디렉션 URL에 AccessToken을 포함
        String redirectUrl = "http://localhost:5173/oauth/redirect?accessToken=" + accessToken;

        // 클라이언트로 리디렉션
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}