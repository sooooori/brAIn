package com.ssafy.brAIn.stomp.service;

import com.ssafy.brAIn.stomp.dto.GroupPost;
import com.ssafy.brAIn.util.RedisUtils;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final RedisUtils redisUtils;

    public MessageService(RedisUtils redisUtils) {
        this.redisUtils = redisUtils;
    }

    public void sendPost(String roomId, GroupPost groupPost) {

        int round= groupPost.getRound();
        String content=groupPost.getContent();
        String key = roomId + ":" + round;
        redisUtils.setData(key,content,3600L);
    }








}
