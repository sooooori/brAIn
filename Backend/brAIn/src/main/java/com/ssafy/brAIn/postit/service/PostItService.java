package com.ssafy.brAIn.postit.service;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.util.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor // final이 붙거나 @NotNull이 붙은 필드의 생성자 추가
@Service // 해당 클래스를 빈으로 서블릿 컨테이너에 등록
public class PostItService {

    RedisUtils redisUtils;
    JWTUtilForRoom jwtUtilForRoom;

    public boolean postItMake(String token, String content){
        String roomId = jwtUtilForRoom.getRoomId(token);
        String nickname = jwtUtilForRoom.getNickname(token);

        String key = String.format("%s:postIt:%s",roomId,nickname);

        redisUtils.setDataInSet(key, content, 3600L);
        return true;
    }
}
