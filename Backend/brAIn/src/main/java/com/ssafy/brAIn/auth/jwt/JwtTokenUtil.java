//package com.ssafy.brAIn.auth.jwt;
//
//import io.jsonwebtoken.*;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.util.Date;
//
//@Component
//public class JwtTokenUtil {
//
//    @Value("${jwt.secret}")
//    private String secret;
//
//    @Value("${jwt.accessTokenExpiration}")
//    private long accessTokenExpiration;
//
//    @Value("${jwt.refreshTokenExpiration}")
//    private long refreshTokenExpiration;
//
//    // 액세스 토큰 생성
//    public String generateAccessToken(String email) {
//        return Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
//                .signWith(SignatureAlgorithm.HS512, secret)
//                .compact();
//    }
//
//    // 리프레시 토큰 생성
//    public String generateRefreshToken(String email) {
//        return Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
//                .signWith(SignatureAlgorithm.HS512, secret)
//                .compact();
//    }
//
//    // 토큰 검증
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//    // 토큰에서 이메일 추출
//    public String getEmailFromToken(String token) {
//        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
//    }
//}