package com.ssafy.brAIn.stomp.controller;

import com.ssafy.brAIn.stomp.dto.*;
import com.ssafy.brAIn.stomp.request.RequestGroupPost;
import com.ssafy.brAIn.stomp.response.ConferencesEnterExit;
import com.ssafy.brAIn.stomp.response.ResponseGroupPost;
import com.ssafy.brAIn.stomp.response.Round;
import com.ssafy.brAIn.stomp.response.Step;
import com.ssafy.brAIn.stomp.service.MessageService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;


@Controller
public class MessageController {

    private final RabbitTemplate rabbitTemplate;
    private final MessageService messageService;
//    private final JWTUtil jwtUtil;

    public MessageController(RabbitTemplate rabbitTemplate, MessageService messageService) {
        this.rabbitTemplate = rabbitTemplate;
        this.messageService = messageService;
        //this.jwtUtil = jwtUtil;
    }

    @MessageMapping("step1.submit.{roomId}")
    public void submitPost(RequestGroupPost groupPost, @DestinationVariable String roomId) {

        ResponseGroupPost responseGroupPost = new ResponseGroupPost(MessageType.SUBMIT_POST_IT,groupPost.getRound(),groupPost.getContent());
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, responseGroupPost);
        messageService.sendPost(Integer.parseInt(roomId),groupPost);

    }

    //다음 라운드로 이동하라는 메시지
    @MessageMapping("next.round.{roomId}")
    public void nextRound(@Payload int curRound, @DestinationVariable String roomId) {

        Round nextRound=new Round(MessageType.NEXT_ROUND,curRound+1);
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, nextRound);
    }

    //대기 방 입장했을 때, 렌더링 시 호출하면 될듯(useEffect 내부에서 publish)
    @MessageMapping("enter.waiting.{roomId}")
    public void enterWaitingRoom(@DestinationVariable String roomId, StompHeaderAccessor accessor){
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit(MessageType.ENTER_WAITING_ROOM));
        String authorization = accessor.getFirstNativeHeader("Authorization");
//        String username=jwtUtil.getUsername(token);
        String username="user";
        messageService.enterWaitingRoom(Integer.parseInt(roomId),username);
    }

    //회의 중간에 입장 시,
//    @MessageMapping("enter.conferences.{roomId}")
//    public void exhalation(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
//        String token=accessor.getFirstNativeHeader("Authorization");
////        String nickname=token.getNickname();
//        String nickname="user"+(int)(Math.random()*100);
//        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit("enter conferences",nickname));
//    }

    //대기 방 퇴장
    @MessageMapping("exit.waiting.{roomId}")
    public void exitWaitingRoom(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit(MessageType.EXIT_WAITING_ROOM));
        String token=accessor.getFirstNativeHeader("Authorization");
//        String username=jwtUtil.getUsername(token);
        String username="user";
        messageService.exitWaitingRoom(Integer.parseInt(roomId),username);
    }

    // 회의 중 퇴장
    @MessageMapping("exit.conferences.{roomId}")
    public void exitConference(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {

        String token=accessor.getFirstNativeHeader("Authorization");
//        String nickname=jwtUtil.getNickname(token);
//        String email=jwtUtil.getEmail(token);
        String nickname="user"+(int)(Math.random()*100);
        String email="123@naver.com";
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit(MessageType.EXIT_CONFERENCES,nickname));
        messageService.historyUpdate(Integer.parseInt(roomId),email);
    }






}
