package com.ssafy.brAIn.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:4173", "https://i11b203.p.ssafy.io")  // 허용할 도메인
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 허용할 HTTP 메소드
                .allowedHeaders("Authorization", "Content-Type", "Accept")  // 허용할 헤더
                .exposedHeaders("Sec-WebSocket-Extensions", "Sec-WebSocket-Key", 
                               "Sec-WebSocket-Version", "Sec-WebSocket-Protocol")  // WebSocket 관련 헤더
                .allowCredentials(true);  // 자격 증명(쿠키 등) 허용 여부
    }
}
