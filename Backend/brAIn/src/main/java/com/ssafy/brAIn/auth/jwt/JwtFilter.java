package com.ssafy.brAIn.auth.jwt;

import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.entity.Role;
import com.ssafy.brAIn.member.service.MemberService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        Cookie[] cookies = request.getCookies();
        // 쿠키없으면 다음 필터로
        if (cookies == null){
            filterChain.doFilter(request, response);
            return;
        }

        // 쿠키에 저장된 토큰 찾기
        String  jwtCookie = "";
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("accessToken")) {
                jwtCookie = cookie.getValue();
            }
        }

        // 토큰까봐서 확인
        Claims claim;
        try {
            claim = JwtUtil.extractToken(jwtCookie);
        } catch (Exception e) {
            System.out.println("토큰 문제발생 : " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        // 사용자 정보 추출
        String email = claim.get("email").toString();
        String name = claim.get("name").toString();
        String role = claim.get("role").toString();

        // 객체 생성
        Member member = Member.builder()
                .email(email)
                .name(name)
                .role(Role.valueOf(role))
                .build();

        // 이상없으면 authToken 변수에 유저정보 추가
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                member,
                null
        );

        // Detail 추가
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
