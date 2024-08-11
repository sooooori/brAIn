package com.ssafy.brAIn.conferenceroom.service;

import com.ssafy.brAIn.ai.response.AIAssistant;
import com.ssafy.brAIn.ai.service.AIService;
import com.ssafy.brAIn.comment.entity.Comment;
import com.ssafy.brAIn.comment.repository.CommentRepository;
import com.ssafy.brAIn.comment.service.CommentService;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceMemberRequest;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceRoomRequest;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.dto.ConferenceToMemberResponse;
import com.ssafy.brAIn.history.entity.MemberHistory;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.openai.service.OpenAiService;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import com.ssafy.brAIn.vote.dto.VoteResponse;
import com.ssafy.brAIn.vote.entity.Vote;
import com.ssafy.brAIn.vote.repository.VoteRepository;
import com.ssafy.brAIn.vote.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor // final이 붙거나 @NotNull이 붙은 필드의 생성자 추가
@Service // 해당 클래스를 빈으로 서블릿 컨테이너에 등록
public class ConferenceRoomService {

    private final ConferenceRoomRepository conferenceRoomRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private final VoteRepository voteRepository;

    @Autowired
    private final CommentRepository commentRepository;

    @Transactional
    public ConferenceRoom save(ConferenceRoom conferenceRoom) {
        //Map<String, Object> res = OpenAiService.sendPostRequest(conferenceRoom.getSubject());
        AIAssistant assistant= aiService.makeAIAssistant(conferenceRoom.getSubject());


        conferenceRoom.updateAi(assistant.getAssistantId(), assistant.getThreadId());
        return conferenceRoomRepository.save(conferenceRoom);
    }

    public ConferenceRoom findByInviteCode(String inviteCode) {
       return conferenceRoomRepository.findByInviteCode(inviteCode).orElse(null);
    }

    public ConferenceRoom findBySecureId(String secureId) {
        return conferenceRoomRepository.findBySecureId(secureId).orElse(null);
    }

    public ConferenceRoom findByRoomId(String roomId) {
        return conferenceRoomRepository.findById(Integer.parseInt(roomId)).orElse(null);
    }


    @Transactional
    public ConferenceMemberRequest saveConferenceHistory(ConferenceMemberRequest conferenceSaveRequest) {
        ConferenceRoom conferenceRoom = conferenceRoomRepository.findById(conferenceSaveRequest.getRoomId())
                .orElseThrow(() -> new RuntimeException("Conference Room not found"));

        // 회의 종료 시간과 시작 시간의 차이 계산
        Date totalTime = getTimeDifference(conferenceRoom.getStartTime(), new Date());

        //회의록 저장
        conferenceRoom.updateConferenceDetails(
                conferenceSaveRequest.getConclusion(),
                new Date()
        );

        // 회의 종료 처리
        conferenceRoom.updateStep(Step.STEP_5);
        ConferenceRoom updated = conferenceRoomRepository.save(conferenceRoom);

        //회원 정보
        List<ConferenceToMemberResponse> members = conferenceSaveRequest.getMembers();
        return new ConferenceMemberRequest(
                updated.getId(),
                updated.getSubject(),
                updated.getConclusion(),
                totalTime,
                members
        );
    }

    //시간 차 계산
    public static Date getTimeDifference(Date startDate, Date endDate) {
        long diffInMillis = endDate.getTime() - startDate.getTime();
        return new Date(diffInMillis - TimeZone.getDefault().getRawOffset());
    }

    // 회의룸 재설정
    public void updateConferenceRoom(Integer roomId, String subject, Date startTime) {
        ConferenceRoom conferenceRoom = conferenceRoomRepository.findById(roomId)
                .orElse(null);

        if (conferenceRoom == null) {
            throw new RuntimeException("Conference Room not found");
        } else {
            conferenceRoom.updateConferenceRoom(subject, startTime);
        }

        conferenceRoomRepository.save(conferenceRoom);
    }

    public String generateMeetingReport(Integer roomId) {
        // Step 1: 특정 회의실 정보와 투표 결과 가져오기
        ConferenceRoom conferenceRoom = conferenceRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID: " + roomId));
        List<Vote> voteResults = voteRepository.findByConferenceRoom_Id(roomId);

        // Step 2: 투표 결과를 점수 기준으로 상위 3개의 아이디어와 나머지 아이디어로 분리
        List<Vote> topThreeIdeas = voteResults.stream()
                .sorted((v1, v2) -> v2.getScore() - v1.getScore())
                .limit(3)
                .toList();

        List<Vote> remainingIdeas = voteResults.stream()
                .sorted((v1, v2) -> v2.getScore() - v1.getScore())
                .skip(3)
                .limit(9)
                .toList();

        // 모든 아이디어를 하나의 리스트로 결합
        List<Vote> allIdeas = new ArrayList<>(topThreeIdeas);
        allIdeas.addAll(remainingIdeas);

        // Step 3: 보고서 작성 시작
        StringBuilder reportBuilder = new StringBuilder();
        reportBuilder.append("Meeting Report\n\n");
        reportBuilder.append("Subject: ").append(conferenceRoom.getSubject()).append("\n\n");  // 회의 주제 추가
        reportBuilder.append("Top 3 Ideas:\n");

        // Step 4: 상위 3개의 아이디어에 대해 관련 정보 추가
        for (Vote vote : topThreeIdeas) {
            RoundPostIt postIt = vote.getRoundPostIt(); // 투표와 연결된 포스트잇 가져오기
            String ideaContent = postIt.getContent(); // 포스트잇 내용 가져오기
            List<Comment> participantComments = commentRepository.findByRoundPostIt_Id(postIt.getId()); // 포스트잇에 대한 코멘트 가져오기

            reportBuilder.append("Idea: ").append(ideaContent).append("\n");
            reportBuilder.append("Participant Comments:\n");
            for (Comment comment : participantComments) {
                reportBuilder.append(" - ").append(comment.getContent()).append("\n");
            }
            reportBuilder.append("\n"); // 다음 아이디어와의 구분을 위해 빈 줄 추가
        }

        // Step 5: 나머지 아이디어에 대해 관련 정보 추가
        reportBuilder.append("Other Ideas:\n");
        for (Vote vote : remainingIdeas) {
            RoundPostIt postIt = vote.getRoundPostIt(); // 투표와 연결된 포스트잇 가져오기
            String ideaContent = postIt.getContent(); // 포스트잇 내용 가져오기
            List<Comment> participantComments = commentRepository.findByRoundPostIt_Id(postIt.getId()); // 포스트잇에 대한 코멘트 가져오기

            reportBuilder.append("Idea: ").append(ideaContent).append("\n");
            reportBuilder.append("Participant Comments:\n");
            for (Comment comment : participantComments) {
                reportBuilder.append(" - ").append(comment.getContent()).append("\n");
            }
            reportBuilder.append("\n"); // 다음 아이디어와의 구분을 위해 빈 줄 추가
        }

        // Step 6: 전체 아이디어에 대한 종합 페르소나 및 SWOT 분석 추가
        String allIdeasContent = allIdeas.stream()
                .map(vote -> vote.getRoundPostIt().getContent())
                .collect(Collectors.joining("\n"));

        String personaResult = aiService.personaMake(allIdeasContent, conferenceRoom.getThreadId(), conferenceRoom.getAssistantId());
        reportBuilder.append("Persona Analysis:\n").append(personaResult).append("\n");

        List<String> allDetails = allIdeas.stream()
                .flatMap(vote -> commentRepository.findByRoundPostIt_Id(vote.getRoundPostIt().getId()).stream().map(Comment::getContent))
                .collect(Collectors.toList());

        String swotResult = aiService.swotMake(allIdeasContent, allDetails, conferenceRoom.getThreadId(), conferenceRoom.getAssistantId());
        reportBuilder.append("SWOT Analysis:\n").append(swotResult).append("\n");

        // Step 7: 최종 보고서 반환
        return reportBuilder.toString();
    }
}