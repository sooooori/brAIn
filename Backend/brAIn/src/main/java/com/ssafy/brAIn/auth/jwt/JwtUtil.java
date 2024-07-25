package com.ssafy.brAIn.auth.jwt;

import com.ssafy.brAIn.member.entity.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static SecretKey key;

    @Value("${jwt.secret}")
    public void setKey(String secret) {
        key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    private static final long accessTokenExpiration = 600000; // 10분
    private static final long refreshTokenExpiration = 1209600000; // 14일

    // accessToken 생성
    public static String createAccessToken(Authentication auth) {
        Member user = (Member) auth.getPrincipal();
        String accessToken = Jwts.builder()
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .claim("role", user.getRole().name())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration)) // 유효기간 10분(1000 = 1초)
                .signWith(key)
                .compact();
        return accessToken;
    }

    // refreshToken 생성
    public static String createRefreshToken(Authentication auth) {
        Member user = (Member) auth.getPrincipal();
        String refreshToken = Jwts.builder()
                .claim("email", user.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration)) // 14일
                .signWith(key)
                .compact();
        return refreshToken;
    }

    // JWT 까주는 함수
    public static Claims extractToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims;
    }
}
