package com.ssafy.brAIn.stomp.config;


<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;
=======
>>>>>>> develop
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
<<<<<<< HEAD
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
=======
>>>>>>> develop
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

<<<<<<< HEAD

        ObjectMapper objectMapper = new ObjectMapper();

        // Java 8 날짜 및 시간 API를 처리
        objectMapper.registerModule(new JavaTimeModule());

        // 생성자의 매개변수 이름을 사용하여 직렬화/역직렬화할 수 있도록 ParameterNamesModule을 등록
        objectMapper.registerModule(new ParameterNamesModule());

        // 기본 타입 정보를 활성화하여 직렬화된 JSON에 타입 정보를 포함
        objectMapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);


        // GenericJackson2JsonRedisSerializer 설정
        // 객체를 JSON으로 직렬화하고, JSON을 객체로 역직렬화
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        redisTemplate.setKeySerializer(new StringRedisSerializer());

//        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(serializer);
=======
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
>>>>>>> develop

        return redisTemplate;
    }
}
