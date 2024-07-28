package com.ssafy.brAIn.auth.jwt;

import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.entity.Role;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
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
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 요청에서 JWT 토큰 추출
        String jwt = extractJwtFromRequest(request);

        if (jwt != null && !jwt.isEmpty()) {
            try {
                // JWT 토큰에서 클레임 추출
                Claims claims = JwtUtil.extractToken(jwt);

                // 클레임에서 정보 가져옴
                String email = claims.get("email").toString();
                String role = claims.get("role").toString();

                // 정보가지고 멤버 객체 생성
                Member member = Member.builder()
                        .email(email)
                        .role(Role.valueOf(role))
                        .build();

                // 스프링 시큐리티의 UsernamePasswordAuthenticationToken을 생성
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        member,
                        null,
                        member.getAuthorities()
                );

                // 요청의 세부 정보를 추가하여 인증 정보를 설정
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (Exception e) {
                System.out.println("토큰문제 발생 : " + e.getMessage());
            }
        }

        // 다음 필터를 호출
        filterChain.doFilter(request, response);
    }

    // 헤더에서 토큰 추출
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // Authorization 헤더가 "Bearer "로 시작하는지 확인
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            // "Bearer " 이후의 토큰 부분을 반환
            return bearerToken.substring(7);
        }
        return null;
    }
}