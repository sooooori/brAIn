package com.ssafy.brAIn.stomp.controller;

import com.ssafy.brAIn.ai.service.AIService;
import com.ssafy.brAIn.auth.jwt.JWTUtilForRoom;
import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.conferenceroom.service.ConferenceRoomService;
import com.ssafy.brAIn.stomp.dto.*;
import com.ssafy.brAIn.stomp.request.RequestGroupPost;
import com.ssafy.brAIn.stomp.request.RequestPass;
import com.ssafy.brAIn.stomp.request.RequestStep;
import com.ssafy.brAIn.stomp.response.*;
import com.ssafy.brAIn.stomp.service.MessageService;
import com.ssafy.brAIn.vote.dto.VoteResponse;
import com.sun.jdi.request.StepRequest;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.List;


@Controller
public class MessageController {

    private final RabbitTemplate rabbitTemplate;
    private final MessageService messageService;

    private final JWTUtilForRoom jwtUtilForRoom;
    private final AIService aiService;
    private final ConferenceRoomService conferenceRoomService;

    public MessageController(RabbitTemplate rabbitTemplate,
                             MessageService messageService,
                             JWTUtilForRoom jwtUtilForRoom,
                             AIService aiService, ConferenceRoomService conferenceRoomService) {
        this.rabbitTemplate = rabbitTemplate;
        this.messageService = messageService;
        this.jwtUtilForRoom = jwtUtilForRoom;
        this.aiService = aiService;
        this.conferenceRoomService = conferenceRoomService;
    }


    //유저 답변 제출완료(테스트 완)
    //유저가 답변을 제출하면 자동으로 다음 사람으로 넘어가야 함.
    @MessageMapping("step1.submit.{roomId}")
    public void submitPost(RequestGroupPost groupPost, @DestinationVariable String roomId,StompHeaderAccessor accessor) {

        String token=accessor.getFirstNativeHeader("Authorization");
        String nickname=jwtUtilForRoom.getNickname(token);
        System.out.println(nickname+"님이 포스트잇을 제출했습니다.");
        ConferenceRoom cr = conferenceRoomService.findByRoomId(roomId);
        aiService.addPostIt(groupPost.getContent(), cr.getThreadId());


        messageService.sendPost(Integer.parseInt(roomId),groupPost,nickname);
        //messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.SUBMIT);
        ResponseGroupPost responseGroupPost=makeResponseGroupPost(groupPost,Integer.parseInt(roomId),nickname);
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, responseGroupPost);

        //끝나면 종료
        if(responseGroupPost.getMessageType().equals(MessageType.SUBMIT_POST_IT_AND_END))return;


        //만약 다음 사람이 ai라면 추가적인 로직 필요
        String nextUser=messageService.NextOrder(Integer.parseInt(roomId),nickname);
        messageService.updateCurOrder(Integer.parseInt(roomId),nextUser);

        boolean curUserIsLast=messageService.isLastOrder(Integer.parseInt(roomId),nickname);

        //다음 사람이 ai가 아니라면 종료
        if(!messageService.isAi(Integer.parseInt(roomId),nextUser))return;
        String aiPostIt=messageService.receiveAImessage(Integer.parseInt(roomId));
        System.out.println("aiPostIt:"+aiPostIt);

        RequestGroupPost aiGroupPost=null;
        if (curUserIsLast) {
            aiGroupPost=new RequestGroupPost(groupPost.getRound()+1,aiPostIt);
        }else{
            aiGroupPost=new RequestGroupPost(groupPost.getRound(),aiPostIt);
        }

        messageService.sendPost(Integer.parseInt(roomId),aiGroupPost,nextUser);
        //messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.SUBMIT);
        ResponseGroupPost aiResponseGroupPost=makeResponseGroupPost(aiGroupPost,Integer.parseInt(roomId),nextUser);
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, aiResponseGroupPost);

    }

    private ResponseGroupPost makeResponseGroupPost(RequestGroupPost groupPost,Integer roomId,String nickname) {
        String nextUser=messageService.NextOrder(roomId,nickname);

        if (messageService.isLastOrder(roomId, nickname)) {
            System.out.println("마지막 사람만 이곳에 와야한다.");

            if (messageService.isStep1EndCondition(roomId)) {
                messageService.updateStep(roomId,Step.STEP_2);
                messageService.initUserState(roomId);
                return new ResponseGroupPost(MessageType.SUBMIT_POST_IT_AND_END,nickname,null,groupPost.getRound(), groupPost.getRound()+1, groupPost.getContent());
            }
                return new ResponseGroupPost(MessageType.SUBMIT_POST_IT,nickname,nextUser,groupPost.getRound(), groupPost.getRound()+1, groupPost.getContent());
        }
        return new ResponseGroupPost(MessageType.SUBMIT_POST_IT,nickname,nextUser,groupPost.getRound(), groupPost.getRound(), groupPost.getContent());
    }

//    //삭제예정
//    //다음 라운드로 이동하라는 메시지(어차피 제출할 때, 다음 라운드까지 제시해줘서 필요없는듯)
//    @MessageMapping("next.round.{roomId}")
//    public void nextRound(@Payload int curRound, @DestinationVariable String roomId) {
//
//        Round nextRound=new Round(MessageType.NEXT_ROUND,curRound+1);
//        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, nextRound);
//    }

    //(테스트 완)
//    //대기 방 입장했을 때, 렌더링 시 호출하면 될듯(useEffect 내부에서 publish)
//    @MessageMapping("enter.waiting.{roomId}")
//    public void enterWaitingRoom(@DestinationVariable String roomId, StompHeaderAccessor accessor){
//        String token = accessor.getFirstNativeHeader("Authorization");
//        String email=JwtUtil.getEmail(token);
//        //messageService.enterWaitingRoom(Integer.parseInt(roomId),email);
//        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit(MessageType.ENTER_WAITING_ROOM));
//
//    }

    //회의 중간에 입장 시,
//    @MessageMapping("enter.conferences.{roomId}")
//    public void exhalation(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
//        String token=accessor.getFirstNativeHeader("Authorization");
////        String nickname=token.getNickname();
//        String nickname="user"+(int)(Math.random()*100);
//        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit("enter conferences",nickname));
//    }

//    //대기 방 퇴장(테스트 완)
//    @MessageMapping("exit.waiting.{roomId}")
//    public void exitWaitingRoom(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
//        String token=accessor.getFirstNativeHeader("Authorization");
//        String email=jwtUtilForRoom.getUsername(token);
//        //messageService.exitWaitingRoom(Integer.parseInt(roomId),nickname);
//        messageService.historyUpdate(Integer.parseInt(roomId),email);
//
//        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new WaitingRoomEnterExit(MessageType.EXIT_WAITING_ROOM));
//
//    }

//    // 회의 중 퇴장(테스트 완)
//    @MessageMapping("exit.conferences.{roomId}")
//    public void exitConference(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
//        String token=accessor.getFirstNativeHeader("Authorization");
//        String nickname=jwtUtilForRoom.getNickname(token);
//        String email=jwtUtilForRoom.getUsername(token);
//        messageService.historyUpdate(Integer.parseInt(roomId),email);
//        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ConferencesEnterExit(MessageType.EXIT_CONFERENCES,nickname));
//    }

    //대기방에서 회의방 시작하기(테스트 완)(아직 secured는 테스트 못함)

    @MessageMapping("start.conferences.{roomId}")
    public void startConference(@DestinationVariable String roomId, StompHeaderAccessor accessor)  {
        String authorization = accessor.getFirstNativeHeader("Authorization");
        System.out.println(authorization);
        String role=jwtUtilForRoom.getRole(authorization);
        System.out.println(role);
        if (!role.equals("CHIEF")) {
            throw new AuthenticationCredentialsNotFoundException("권한이 없음");
        }
        System.out.println(roomId);
        List<String> users=messageService.startConferences(Integer.parseInt(roomId)).stream()
                .map(Object::toString)
                .toList();

        //초기화
        messageService.initUserState(Integer.parseInt(roomId));

        //0단계 부터  시작.
        ConferenceRoom conferenceRoom = conferenceRoomService.findByRoomId(roomId).updateStep(Step.STEP_0);
//        MessagePostProcessor messagePostProcessor = message -> {
//            message.getMessageProperties().setHeader("Authorization", "회의 토큰");
//            return message;
//        };

        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new StartMessage(MessageType.START_CONFERENCE,users));

    }

    //회의 다음단계 시작(테스트 완)(Secured미완)

    @MessageMapping("next.step.{roomId}")
    //@PreAuthorize("hasAuthority('ROLE_CHIEF')")
    public void nextStep(@Payload RequestStep requestStep, @DestinationVariable String roomId,StompHeaderAccessor accessor) {

        String authorization = accessor.getFirstNativeHeader("Authorization");
        String role=jwtUtilForRoom.getRole(authorization);
        if (!role.equals("CHIEF")) {
            throw new AuthenticationCredentialsNotFoundException("권한이 없음");
        }

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

    //유저 답변 패스(테스트 완)
    @MessageMapping("state.user.pass.{roomId}")
    public void passRound(@DestinationVariable String roomId, StompHeaderAccessor accessor, RequestPass pass) {
        String token=accessor.getFirstNativeHeader("Authorization");
        String nickname=jwtUtilForRoom.getNickname(token);

        messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.PASS);
        String nextMember=messageService.NextOrder(Integer.parseInt(roomId),nickname);

        //현재 유저가 라운드의 마지막 유저라면
        if (messageService.isLastOrder(Integer.parseInt(roomId),nickname)) {
            //종료 조건이라면
            System.out.println("마지막 사람 패스했을 때, 종료조건 만족?:"+messageService.isStep1EndCondition(Integer.parseInt(roomId)));
            if (messageService.isStep1EndCondition(Integer.parseInt(roomId))) {
                System.out.println("패스 후 종료");
                messageService.updateStep(Integer.parseInt(roomId),Step.STEP_2);
                rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponsePassAndEnd(MessageType.PASS_AND_END,nickname));
                messageService.initUserState(Integer.parseInt(roomId));
                return;
            }
            messageService.initUserState(Integer.parseInt(roomId));
        }
        messageService.updateCurOrder(Integer.parseInt(roomId),nextMember);
        rabbitTemplate.convertAndSend("amq.topic","room."+roomId,new ResponseRoundState(UserState.PASS,nickname,nextMember));

        //다음 사람이 ai가 아니라면 종료
        if(!messageService.isAi(Integer.parseInt(roomId),nextMember))return;
        String aiPostIt=messageService.receiveAImessage(Integer.parseInt(roomId));
        //System.out.println("aiPostIt:"+aiPostIt);



        boolean curUserIsLast=messageService.isLastOrder(Integer.parseInt(roomId),nickname);

        RequestGroupPost aiGroupPost=null;
        if (curUserIsLast) {
            aiGroupPost=new RequestGroupPost(pass.getCurRound()+1,aiPostIt);
        }else{
            aiGroupPost=new RequestGroupPost(pass.getCurRound(),aiPostIt);
        }

        messageService.sendPost(Integer.parseInt(roomId),aiGroupPost,nextMember);
        //messageService.updateUserState(Integer.parseInt(roomId),nickname,UserState.SUBMIT);

        ResponseGroupPost aiResponseGroupPost=makeResponseGroupPost(aiGroupPost,Integer.parseInt(roomId),nextMember);
        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, aiResponseGroupPost);

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


    // 현재 중간 투표 결과 반환
    // 현재 중간 투표 결과 (상위 9개) 반환
    @MessageMapping("vote.middleResults.{roomId}.{step}")
    public void getMiddleVoteResults(@DestinationVariable String roomId, @DestinationVariable String step, StompHeaderAccessor accessor) {
        String token = accessor.getFirstNativeHeader("Authorization");
        String nickName = jwtUtilForRoom.getNickname(token);
        ConferenceRoom conferenceRoom = conferenceRoomService.findByRoomId(roomId);

        // 중간 투표 결과 가져오기
        ResponseMiddleVote voteResults = messageService.getMiddleVote(Integer.parseInt(roomId), step);

        List<VoteResponse> temp=voteResults.getVotes();

        for(int i=0;i<temp.size();i++){
            System.out.println(temp.get(i).getPostIt());
        }

        System.out.println("마지막:"+temp.size());
        // 결과를 RabbitMQ로 전송
        rabbitTemplate.convertAndSend("amq.topic", "room." + roomId, voteResults);
    }


    // 현재 최종 투표 결과 반환
    // 현재 최종 투표 결과 (상위 3개) 반환
    @MessageMapping("vote.finalResults.{roomId}.{round}") // (Send Topic 매핑)
    public void getFinalVoteResults(@DestinationVariable String roomId, @DestinationVariable Integer round, StompHeaderAccessor accessor) {
        String token = accessor.getFirstNativeHeader("Authorization");
        String nickName = jwtUtilForRoom.getNickname(token);
        ConferenceRoom conferenceRoom = conferenceRoomService.findByRoomId(roomId);

        // 최종 투표 결과 가져오기
        ResponseMiddleVote voteResults = messageService.getFinalVote(Integer.parseInt(roomId), round);
        // 결과를 RabbitMQ로 전송(Subscribe)
        rabbitTemplate.convertAndSend("amq.topic", "room." + roomId, voteResults);
    }
}
