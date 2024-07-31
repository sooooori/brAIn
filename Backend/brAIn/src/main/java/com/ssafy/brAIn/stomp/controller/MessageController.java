package com.ssafy.brAIn.stomp.controller;

import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.stomp.dto.*;
import com.ssafy.brAIn.stomp.request.RequestGroupPost;
import com.ssafy.brAIn.stomp.request.RequestStep;
import com.ssafy.brAIn.stomp.response.*;
import com.ssafy.brAIn.stomp.service.MessageService;
import com.sun.jdi.request.StepRequest;
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

    private final JWTUtilForRoom jwtUtilForRoom;

    public MessageController(RabbitTemplate rabbitTemplate,
                             MessageService messageService,
                             JWTUtilForRoom jwtUtilForRoom) {
        this.rabbitTemplate = rabbitTemplate;
        this.messageService = messageService;
        this.jwtUtilForRoom = jwtUtilForRoom;
    }


    //유저 답변 제출완료(테스트 완)
    //유저가 답변을 제출하면 자동으로 다음 사람으로 넘어가야 함.
    @MessageMapping("step1.submit.{roomId}")
    public void submitPost(RequestGroupPost groupPost, @DestinationVariable String roomId,StompHeaderAccessor accessor) {

        String token=accessor.getFirstNativeHeader("Authorization");
        String nickname=jwtUtilForRoom.getNickname(token);
        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.SUBMIT);

        ResponseGroupPost responseGroupPost=null;

        if (messageService.isLastOrder(Integer.parseInt(roomId), nickname)) {
            responseGroupPost = new ResponseGroupPost(MessageType.SUBMIT_POST_IT,nickname,groupPost.getRound(), groupPost.getRound()+1, groupPost.getContent());
        }else{
            responseGroupPost = new ResponseGroupPost(MessageType.SUBMIT_POST_IT,nickname,groupPost.getRound(), groupPost.getRound(), groupPost.getContent());
        }
        messageService.sendPost(Integer.parseInt(roomId),groupPost);
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, responseGroupPost);


    }
    //삭제예정
    //다음 라운드로 이동하라는 메시지(어차피 제출할 때, 다음 라운드까지 제시해줘서 필요없는듯)
    @MessageMapping("next.round.{roomId}")
    public void nextRound(@Payload int curRound, @DestinationVariable String roomId) {

        Round nextRound=new Round(MessageType.NEXT_ROUND,curRound+1);
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, nextRound);
    }

    //(테스트 완)
    //대기 방 입장했을 때, 렌더링 시 호출하면 될듯(useEffect 내부에서 publish)
    @MessageMapping("enter.waiting.{roomId}")
    public void enterWaitingRoom(@DestinationVariable String roomId, StompHeaderAccessor accessor){
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit(MessageType.ENTER_WAITING_ROOM));
        String token = accessor.getFirstNativeHeader("Authorization");
        String email=JwtUtil.getEmail(token);
        messageService.enterWaitingRoom(Integer.parseInt(roomId),email);
    }

    //회의 중간에 입장 시,
//    @MessageMapping("enter.conferences.{roomId}")
//    public void exhalation(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
//        String token=accessor.getFirstNativeHeader("Authorization");
////        String nickname=token.getNickname();
//        String nickname="user"+(int)(Math.random()*100);
//        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit("enter conferences",nickname));
//    }

    //대기 방 퇴장(테스트 완)
    @MessageMapping("exit.waiting.{roomId}")
    public void exitWaitingRoom(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit(MessageType.EXIT_WAITING_ROOM));
        String token=accessor.getFirstNativeHeader("Authorization");
//        String username=jwtUtil.getUsername(token);
        String username="user";
        messageService.exitWaitingRoom(Integer.parseInt(roomId),username);
    }

    // 회의 중 퇴장(테스트 완)
    @MessageMapping("exit.conferences.{roomId}")
    public void exitConference(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {

        String token=accessor.getFirstNativeHeader("Authorization");
        String nickname=jwtUtilForRoom.getNickname(token);
        String email=jwtUtilForRoom.getUsername(token);
        messageService.historyUpdate(Integer.parseInt(roomId),email);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit(MessageType.EXIT_CONFERENCES,nickname));
    }

    //대기방에서 회의방 시작하기(테스트 완)(아직 secured는 테스트 못함)
    @Secured("ROLE_CHIEF")
    @MessageMapping("start.conferences.{roomId}")
    public void startConference(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
        String token=accessor.getFirstNativeHeader("Authorization");
        String chiefEmail=jwtUtilForRoom.getUsername(token);

        List<String> users=messageService.startConferences(Integer.parseInt(roomId),chiefEmail).stream()
                .map(Object::toString)
                .toList();


        MessagePostProcessor messagePostProcessor = message -> {
            message.getMessageProperties().setHeader("Authorization", "회의 토큰");
            return message;
        };
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new StartMessage(MessageType.START_CONFERENCE,users),messagePostProcessor);

    }

    //회의 다음단계 시작(테스트 완)(Secured미완)
    @Secured("ROLE_CHIEF")
    @MessageMapping("next.step.{roomId}")
    public void nextStep(@Payload RequestStep requestStep, @DestinationVariable String roomId) {

        Step nextStep=requestStep.getStep().next();
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponseStep(MessageType.NEXT_STEP,nextStep));
        messageService.updateStep(Integer.parseInt(roomId),nextStep);
    }

    //유저 준비 완료
    @MessageMapping("state.user.{roomId}")
    public void readyState(@DestinationVariable String roomId, StompHeaderAccessor accessor) {
        String token=accessor.getFirstNativeHeader("Authorization");
        String nickname=jwtUtilForRoom.getNickname(token);

        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.READY);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponseUserState(UserState.READY,nickname));

    }

    //유저 답변 패스
    @MessageMapping("state.user.pass.{roomId}")
    public void passRound(@DestinationVariable String roomId, StompHeaderAccessor accessor) {
        String token=accessor.getFirstNativeHeader("Authorization");
        String nickname=jwtUtilForRoom.getNickname(token);
        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.PASS);
        String nextMember=messageService.NextOrder(Integer.parseInt(roomId),nickname);
        messageService.updateCurOrder(Integer.parseInt(roomId),nextMember);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponseRoundState(UserState.PASS,nickname,nextMember));

    }

    //타이머 시간 추가
    @MessageMapping("timer.modify.{roomId}")
    public void modifyTimer(@DestinationVariable String roomId, @Payload Long time, StompHeaderAccessor accessor) {
        String token=accessor.getFirstNativeHeader("Authorization");
        String sender=jwtUtilForRoom.getNickname(token);
        String curUser=messageService.getCurUser(Integer.parseInt(roomId));
        if(!sender.equals(curUser))return;
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new Timer(MessageType.PLUS_TIME,time));
    }














}
