package com.ssafy.brAIn.util;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisUtils {

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisUtils(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setData(String key,String content,Long expireTime) {

        redisTemplate.opsForList().rightPush(key, content);
        redisTemplate.expire(key, expireTime, TimeUnit.SECONDS);
    }

    public void removeDataInList(String key,String content) {
        redisTemplate.opsForList().remove(key, 1, content);
    }


}
