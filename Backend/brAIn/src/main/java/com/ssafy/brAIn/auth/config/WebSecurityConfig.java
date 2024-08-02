package com.ssafy.brAIn.auth.config;

import com.ssafy.brAIn.auth.jwt.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
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
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

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
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // cors 설정
                .formLogin(AbstractHttpConfigurer::disable)  // 폼로그인 해제
                .logout(logout -> logout
                        .invalidateHttpSession(true)  // 로그아웃 시 세션 무효화
                        .deleteCookies("refreshToken")
                        .logoutUrl("/api/v1/members/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                )
                .authorizeHttpRequests(requests -> {
                    requests.requestMatchers(  // 허용 URL
                            "/api/v1/members/join",
                            "/api/v1/members/login",
                            "/api/v1/members/refresh",
                            "/**"
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

    // CORS 설정 빈
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost")); // 클라이언트 도메인
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
//        configuration.setAllowCredentials(true);

        configuration.addAllowedOrigin("*");
        configuration.setAllowCredentials(false);

        // WebSocket을 위한 추가 설정
        configuration.addAllowedHeader("Sec-WebSocket-Extensions");
        configuration.addAllowedHeader("Sec-WebSocket-Key");
        configuration.addAllowedHeader("Sec-WebSocket-Version");
        configuration.addAllowedHeader("Sec-WebSocket-Protocol");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
