package com.ssafy.brAIn.auth.config;

import com.ssafy.brAIn.auth.jwt.JwtFilter;
import com.ssafy.brAIn.auth.oauth.OAuth2LoginSuccessHandler;
import com.ssafy.brAIn.member.service.MemberDetailService;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
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
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final MemberDetailService memberDetailService;

    // 패스워드 인코더로 사용할 빈 등록
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 스프링 시큐리티 기능 비활성화
    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                .requestMatchers(new AntPathRequestMatcher("/static/**"));
    }

    // 특정 HTTP 요청에 대한 웹 기반 보안 구성
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        return http
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
//                .authorizeHttpRequests(auth->auth
//                        .anyRequest().permitAll())
//                .csrf(AbstractHttpConfigurer::disable) // csrf 비활성화
//주석

        return http
                .httpBasic(AbstractHttpConfigurer::disable)  // 기본인증 해제
                .csrf(AbstractHttpConfigurer::disable)       // csrf 해제
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // cors 설정
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

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 인증 관리자 관련 설정
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder, MemberDetailService memberDetailService) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(memberDetailService); // 사용자 정보 서비스 설정
        authProvider.setPasswordEncoder(bCryptPasswordEncoder);
        return new ProviderManager(authProvider);
    }

    // CORS 설정을 위한 빈 등록
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // 리액트 앱의 주소를 허용
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
}
