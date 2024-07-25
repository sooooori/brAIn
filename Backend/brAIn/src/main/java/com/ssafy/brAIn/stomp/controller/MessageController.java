package com.ssafy.brAIn.stomp.controller;

import com.ssafy.brAIn.stomp.dto.ConferencesEnterExit;
import com.ssafy.brAIn.stomp.dto.GroupPost;
import com.ssafy.brAIn.stomp.dto.Round;
import com.ssafy.brAIn.stomp.dto.WaitingRoomEnterExit;
import com.ssafy.brAIn.stomp.service.MessageService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.io.IOException;


@Controller
public class MessageController {

    private final RabbitTemplate rabbitTemplate;
    private final MessageService messageService;

    public MessageController(RabbitTemplate rabbitTemplate, MessageService messageService) {
        this.rabbitTemplate = rabbitTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("step1.submit.{roomId}")
    public void submitPost(GroupPost groupPost, @DestinationVariable String roomId) {

        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, groupPost);
        messageService.sendPost(roomId,groupPost);

    }

    @MessageMapping("next.round.{roomId}")
    public void nextRound(Round curRound, @DestinationVariable String roomId) {

        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, curRound);
    }

    //대기 방 입장했을 때, 렌더링 시 호출하면 될듯(useEffect 내부에서 publish)
    @MessageMapping("enter.waiting.{roomId}")
    public void enterWaitingRoom(@DestinationVariable String roomId, StompHeaderAccessor accessor){
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit("enter waitingRoom"));
        String authorization = accessor.getFirstNativeHeader("Authorization");
//        String username=authorization.getUsername();

    }

    //회의 중간에 입장 시,
    @MessageMapping("enter.conferences.{roomId}")
    public void exhalation(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
        String token=accessor.getFirstNativeHeader("Authorization");
//        String nickname=token.getNickname();
        String nickname="user"+(int)(Math.random()*100);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit("enter conferences",nickname));
    }

    //대기 방 퇴장
    @MessageMapping("exit.waiting.{roomId}")
    public void exitWaitingRoom(@DestinationVariable String roomId)  {
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit("exit waitingRoom"));
    }

    // 회의 중 퇴장
    @MessageMapping("exit.conferences.{roomId}")
    public void exitConference(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
        String token=accessor.getFirstNativeHeader("Authorization");
//        String nickname=token.getNickname();
        String nickname="user"+(int)(Math.random()*100);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit("exit conferences",nickname));

    }




}
