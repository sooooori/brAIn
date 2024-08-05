package com.ssafy.brAIn.auth.oauth.google.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.entity.Role;
import com.ssafy.brAIn.member.entity.Social;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.member.service.S3Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;


@Service
@RequiredArgsConstructor
public class GoogleService {

    private final MemberRepository memberRepository;
    private final S3Service s3Service;

    @Value("${google.key.client-id}")
    private String clientId;

    @Value("${google.key.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;


    public String googleLogin(String code, HttpServletResponse response) {
        // 1. "인가 코드"로 "엑세스 토큰" 요청
        String googleAccessToken = getAccessToken(code);

        // 2. 토큰으로 구글 사용자 정보 API 호출
        JsonNode userInfo = getGoogleUserInfo(googleAccessToken);

        // 3. 구글 사용자 정보로 회원가입 및 로그인 처리
        return googleUserLogin(userInfo, response);
    }

    // 1. "인가 코드"로 "액세스 토큰" 요청
    private String getAccessToken(String code) {
        String tokenEndpoint = "https://oauth2.googleapis.com/token";

        // HTTP Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // HTTP Body 생성
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        // HTTP 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<MultiValueMap<String, String>> googleTokenRequest = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(tokenEndpoint, googleTokenRequest, String.class);

        // HTTP 응답 (JSON) -> 액세스 토큰 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = null;
        try {
            jsonNode = objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
        }
        assert jsonNode != null;
        return jsonNode.get("access_token").asText(); // 액세스 토큰 반환
    }

    // 2. 토큰으로 구글 사용자 정보 API 호출
    private JsonNode getGoogleUserInfo(String accessToken) {
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";

        // HTTP Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        // HTTP 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<String> googleUserInfoRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                userInfoEndpoint,
                HttpMethod.GET,
                googleUserInfoRequest,
                String.class
        );

        // responseBody에 있는 정보를 꺼냄
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = null;
        try {
            jsonNode = objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return jsonNode;
    }

    // 3. 구글 사용자 정보로 회원가입 및 로그인 처리
    private String googleUserLogin(JsonNode userInfo, HttpServletResponse response) {
        // 사용자 정보 가져오기
        String googleEmail = userInfo.get("email").asText();
        String name = userInfo.get("name").asText();

        // 이메일 중복 확인
        Member googleUser = memberRepository.findByEmail(googleEmail)
                .orElse(null);

        if (googleUser == null) {
            // 신규 사용자 회원가입
            googleUser = Member.builder()
                    .email(googleEmail)
                    .name(name)
                    .role(Role.USER)
                    .social(Social.Google)
                    .locked(false)
                    .loginFailCount(0)
                    .build();

            // 프로필 이미지 설정
            String profileImageUrl = s3Service.getRandomImageUrl();
            googleUser.updatePhoto(profileImageUrl);

            // 사용자 저장
            memberRepository.save(googleUser);
        }

        // 사용자 인증 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                googleUser,
                null,
                googleUser.getAuthorities()
        );

        // JWT 토큰 생성
        String accessToken = JwtUtil.createAccessToken(authentication);
        String refreshToken = JwtUtil.createRefreshToken(authentication);

        // Refresh Token을 DB에 저장
        googleUser.updateRefreshToken(refreshToken);
        memberRepository.save(googleUser);

        // Refresh Token을 쿠키에 저장
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setMaxAge(1209600); // 14일 설정
        cookie.setHttpOnly(true); // HttpOnly 설정
        cookie.setPath("/"); // 쿠키 경로 설정
        response.addCookie(cookie);

        // 액세스 토큰 반환
        return accessToken;
    }
}
