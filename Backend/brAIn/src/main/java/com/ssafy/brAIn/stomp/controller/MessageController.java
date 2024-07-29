package com.ssafy.brAIn.stomp.controller;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.stomp.dto.*;
import com.ssafy.brAIn.stomp.request.RequestGroupPost;
import com.ssafy.brAIn.stomp.response.*;
import com.ssafy.brAIn.stomp.service.MessageService;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

import java.util.List;


@Controller
public class MessageController {

    private final RabbitTemplate rabbitTemplate;
    private final MessageService messageService;
    private final JwtUtil jwtUtil;
//    private final JWTUtil jwtUtil;

    public MessageController(RabbitTemplate rabbitTemplate, MessageService messageService, JwtUtil jwtUtil) {
        this.rabbitTemplate = rabbitTemplate;
        this.messageService = messageService;
        //this.jwtUtil = jwtUtil;
        this.jwtUtil = jwtUtil;
    }


    //유저 답변 제출완료
    @MessageMapping("step1.submit.{roomId}")
    public void submitPost(RequestGroupPost groupPost, @DestinationVariable String roomId,StompHeaderAccessor accessor) {

        String token=accessor.getFirstNativeHeader("Authorization");
//        String nickname=jwtUtil.getNickname(token);
        String nickname="userA";
        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.SUBMIT);

        messageService.

        ResponseGroupPost responseGroupPost = new ResponseGroupPost(MessageType.SUBMIT_POST_IT,groupPost.getRound(),groupPost.getContent());
        messageService.sendPost(Integer.parseInt(roomId),groupPost);
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, responseGroupPost);


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

    //대기방에서 회의방 시작하기
    @Secured("ROLE_CHIEF")
    @MessageMapping("start.conferences.{roomId}")
    public void startConference(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
        String token=accessor.getFirstNativeHeader("Authorization");
//        String chiefEmail=jwtUtil.getEmail(token);
        String chiefEmail="123@naver.com";
        List<String> users=messageService.startConferences(Integer.parseInt(roomId),chiefEmail).stream()
                .map(Object::toString)
                .toList();


        MessagePostProcessor messagePostProcessor = message -> {
            message.getMessageProperties().setHeader("Authorization", "회의 토큰");
            return message;
        };
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new StartMessage(MessageType.START_CONFERENCE,users));

    }

    //회의 다음단계 시작
    @Secured("ROLE_CHIEF")
    @MessageMapping("next.step.{roomId}")
    public void nextStep(@Payload Step step, @DestinationVariable String roomId) {

        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponseStep(MessageType.NEXT_STEP,step.next()));
        messageService.updateStep(Integer.parseInt(roomId),step.next());
    }

    //유저 준비 완료
    @MessageMapping("state.user.{roomId}")
    public void readyState(@DestinationVariable String roomId, StompHeaderAccessor accessor) {
        String token=accessor.getFirstNativeHeader("Authorization");
//        String nickname=jwtFilter.getNickname(token);
        String nickname="userA";

        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.READY);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponseUserState(UserState.READY,nickname));

    }

    //유저 답변 패스
    @MessageMapping("state.user.pass.{rommId}")
    public void passRound(@DestinationVariable String roomId, StompHeaderAccessor accessor) {
        String token=accessor.getFirstNativeHeader("Authorization");
        //        String nickname=jwtFilter.getNickname(token);
        String nickname="userA";
        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.PASS);
        String nextMember=messageService.NextOrder(Integer.parseInt(roomId),nickname);
        messageService.updateCurOrder(Integer.parseInt(roomId),nextMember);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponseRoundState(UserState.PASS,nickname,nextMember));

    }

    //유저 답변 제출
    @MessageMapping("state.user.submit.{roomId}")
    public void submit(@DestinationVariable String roomId, StompHeaderAccessor accessor) {
        String token=accessor.getFirstNativeHeader("Authorization");
        //        String nickname=jwtFilter.getNickname(token);
        String nickname="userA";
        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.SUBMIT);
        rabbitTemplate
    }











}
