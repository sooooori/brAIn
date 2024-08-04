package com.ssafy.brAIn.stomp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    //private final AuthorizationManager<Message<?>> authorizationManager;
    private final CsrfChannelInterceptor csrfChannelInterceptor;

    public WebSocketConfig(CsrfChannelInterceptor csrfChannelInterceptor) {
        //this.authorizationManager = authorizationManager;

        this.csrfChannelInterceptor = csrfChannelInterceptor;

    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setPathMatcher(new AntPathMatcher("."));
        config.setApplicationDestinationPrefixes("/app")
                .enableStompBrokerRelay("/topic","/queue", "/exchange", "/amq/queue");

    }



    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*");
//                .setHandshakeHandler(new DefaultHandshakeHandler() {
//                    @Override
//                    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
//                        // Assuming SecurityContextHolder contains Authentication
//                        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//                        if (authentication != null) {
//                            return new Principal() {
//                                @Override
//                                public String getName() {
//                                    return authentication.getName();
//                                }
//                            };
//                        }
//                        return null;
//                    }
//                });
//                .addInterceptors(httpSessionHandshakeInterceptor);

    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(csrfChannelInterceptor);
    }


    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.addDecoratorFactory(new SecurityContextWebSocketHandlerDecoratorFactory());
    }


}

