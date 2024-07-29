package com.ssafy.brAIn.auth.config;

import com.ssafy.brAIn.auth.jwt.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.ExceptionTranslationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtFilter jwtFilter;

    // 패스워드 암호화
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

    // 특정 HTTP 요청에 대한 웹 기반 보안 구성
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
//                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 추가
//                .authorizeHttpRequests(auth -> auth // 인증, 인가 설정
//                        .anyRequest().permitAll()
//                        .requestMatchers(
//                                new AntPathRequestMatcher("/api/v1/members/join"),
//                                new AntPathRequestMatcher("/")
//                        ).permitAll()
//                        .anyRequest().authenticated())
//                .formLogin(AbstractHttpConfigurer::disable) // 폼 기반 로그인 비활성화
//                .logout(logout -> logout // 로그아웃 설정
//                        .logoutSuccessUrl("/api/v1/members/login")
//                        .invalidateHttpSession(true)
//                )
                .authorizeHttpRequests(auth->auth
                        .anyRequest().permitAll())
                .csrf(AbstractHttpConfigurer::disable) // csrf 비활성화
//주석

                .build();
    }
}
