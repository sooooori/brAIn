package com.ssafy.brAIn.util;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.RedisTemplate;

import static org.junit.jupiter.api.Assertions.*;

class RedisUtilsTest {

    @Test
    void getScoreFromSortedSet() {

        //give
        RedisUtils redisUtils=new RedisUtils(new RedisTemplate<>(), new RedisTemplate<>());

        //
        Double score=redisUtils.getScoreFromSortedSet("1:order","호랑이1");

        //then
        Assertions.assertThat(score).isEqualTo(3.0);
    }
}