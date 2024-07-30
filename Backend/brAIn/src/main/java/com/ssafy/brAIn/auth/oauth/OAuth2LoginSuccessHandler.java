package com.ssafy.brAIn.auth.oauth;

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
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberRepository memberRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // OAuth2User 객체에서 사용자 정보를 가져옴
        DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();

        // 제공자별로 사용자 정보를 추출
        String email = null;
        String name = null;
        Social social = null;

        Map<String, Object> attributes = oauth2User.getAttributes();

        if (attributes.containsKey("email")) {
            // 구글 로그인 처리
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            social = Social.Google;
        } else if (attributes.containsKey("kakao_account")) {
            // 카카오 로그인 처리
            Object kakaoAccountObj = attributes.get("kakao_account");
            if (kakaoAccountObj instanceof Map<?, ?> kakaoAccount) {
                email = (String) kakaoAccount.get("email");

                Object profileObj = kakaoAccount.get("profile");
                if (profileObj instanceof Map<?, ?> profile) {
                    name = (String) profile.get("nickname");
                }
            }
            social = Social.Kakao;
        }

        if (email == null) {
            throw new IllegalArgumentException("Email not found from OAuth2 provider");
        }

        // 람다식에서 사용될 변수를 final로 선언하여 사용
        final String finalEmail = email;
        final String finalName = name;
        final Social finalSocial = social;

        // 데이터베이스에서 사용자 정보를 조회하거나 없으면 새로 생성
        Member member = memberRepository.findByEmail(finalEmail).orElseGet(() ->
                memberRepository.save(Member.builder()
                        .email(finalEmail)
                        .name(finalName)
                        .role(Role.USER)
                        .social(finalSocial)
                        .locked(true)
                        .loginFailCount(0)
                        .photo("null")
                        .password(finalSocial + "LoginUser")
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