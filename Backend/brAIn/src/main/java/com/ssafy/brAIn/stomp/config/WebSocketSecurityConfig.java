package com.ssafy.brAIn.stomp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.util.AntPathMatcher;

@Configuration
@EnableWebSecurity
public class WebSocketSecurityConfig  {

    @Bean
    public MessageMatcherDelegatingAuthorizationManager.Builder messageMatcherDelegatingAuthorizationManager() {

        return MessageMatcherDelegatingAuthorizationManager.builder();
    }

    @Bean
    AuthorizationManager<Message<?>> authorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
        messages
                .simpDestMatchers("/app/start.conferences.*").hasRole("CHIEF")
                .simpDestMatchers("/app/next.step.*").hasRole("CHIEF")

                .anyMessage().permitAll();
        return messages.build();
    }
}
