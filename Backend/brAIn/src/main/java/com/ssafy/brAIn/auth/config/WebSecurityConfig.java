package com.ssafy.brAIn.auth.config;

import com.ssafy.brAIn.auth.jwt.JwtFilter;
import com.ssafy.brAIn.auth.oauth.OAuth2LoginSuccessHandler;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtFilter jwtFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

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
//                .cors(AbstractHttpConfigurer::disable)       // cors 해제
                .formLogin(AbstractHttpConfigurer::disable)  // 폼로그인 해제
                .logout(logout -> logout
                        .invalidateHttpSession(true)  // 로그아웃 시 세션 무효화
                )
                .authorizeHttpRequests(requests -> {
                    requests.requestMatchers(  // 허용 URL
                            "/api/v1/members/join",
                            "/api/v1/members/login",
                            "/api/v1/members/refresh",
                            "/oauth/**",
                            "/**"
                            ).permitAll();
                    requests.anyRequest().authenticated(); // 모든 URL 인증 필요
                })
                .sessionManagement(  // 세션방식 해제
                        sessionManagement ->
                                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Oauth 로그인 추가 및 성공핸들러 추가
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler))
                // 필터 적용 (유효토큰 확인)
                .addFilterBefore(jwtFilter, ExceptionTranslationFilter.class)
                .build();
    }

    // CORS 설정 빈
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // 클라이언트 도메인
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
