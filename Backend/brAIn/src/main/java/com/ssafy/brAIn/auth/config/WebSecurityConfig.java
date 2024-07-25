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

        return httpSecurity
                .httpBasic(AbstractHttpConfigurer::disable)  // 기본인증 해제
                .csrf(AbstractHttpConfigurer::disable)       // csrf 해제
                .cors(AbstractHttpConfigurer::disable)       // cors 해제
                .formLogin(AbstractHttpConfigurer::disable)  // 폼로그인 해제
                .logout(logout -> logout
                        .invalidateHttpSession(true)  // 로그아웃하면 모든데이터 삭제
                )
                .authorizeHttpRequests(requests -> {
                    requests.requestMatchers(  // 허용 URL
                            "/api/v1/members/join",
                            "/api/v1/members/login",
                            "/api/v1/members/refresh"
                            ).permitAll();
                    requests.anyRequest().authenticated(); // 모든 URL 인증 필요
                })
                .sessionManagement(  // 세션방식 해제
                        sessionManagement ->
                                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 필터 적용 (유효토큰 확인)
                .addFilterBefore(jwtFilter, ExceptionTranslationFilter.class)
                .build();
    }
}
