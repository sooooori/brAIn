package com.ssafy.brAIn.conferenceroom.service;

import com.ssafy.brAIn.ai.response.AIAssistant;
import com.ssafy.brAIn.ai.service.AIService;
import com.ssafy.brAIn.comment.entity.Comment;
import com.ssafy.brAIn.comment.repository.CommentRepository;
import com.ssafy.brAIn.conferenceroom.dto.ConferenceMemberRequest;
import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.entity.Step;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.dto.ConferenceToMemberResponse;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import com.ssafy.brAIn.vote.entity.Vote;
import com.ssafy.brAIn.vote.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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

    // 회의 결과 요약 정보
    public String generateMeetingReport(Integer roomId) {
        ConferenceRoom conferenceRoom = conferenceRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID: " + roomId));
        List<Vote> voteResults = voteRepository.findByConferenceRoom_Id(roomId);

        log.info("Assistance_id ={}", conferenceRoom.getAssistantId());
        log.info("Thread_id={}", conferenceRoom.getThreadId());

        List<Vote> topThreeIdeas = voteResults.stream()
                .sorted((v1, v2) -> v2.getScore() - v1.getScore())
                .limit(3)
                .toList();

        List<Vote> remainingIdeas = voteResults.stream()
                .sorted((v1, v2) -> v2.getScore() - v1.getScore())
                .skip(3)
                .limit(9)
                .toList();

        List<Vote> allIdeas = new ArrayList<>(topThreeIdeas);
        allIdeas.addAll(remainingIdeas);

        String allIdeasContent = allIdeas.stream()
                .map(vote -> vote.getRoundPostIt().getContent())
                .collect(Collectors.joining("\n"));

        List<String> allDetails = allIdeas.stream()
                .flatMap(vote -> commentRepository.findByRoundPostIt_Id(vote.getRoundPostIt().getId()).stream().map(Comment::getContent))
                .collect(Collectors.toList());

        String summary = aiService.makeSummary(conferenceRoom.getThreadId(), conferenceRoom.getAssistantId());

        String personaResult = aiService.personaMake(allIdeasContent, conferenceRoom.getThreadId(), conferenceRoom.getAssistantId());
        String swotResult = aiService.swotMake(allIdeasContent, allDetails, conferenceRoom.getThreadId(), conferenceRoom.getAssistantId());

        log.info("Generated summary: {}", summary);
        log.info("Generated persona: {}", personaResult);
        log.info("Generated SWOT: {}", swotResult);

        StringBuilder reportBuilder = new StringBuilder();
        reportBuilder.append("Meeting Report\n\n");
        reportBuilder.append("Subject: ").append(conferenceRoom.getSubject()).append("\n\n");
        reportBuilder.append("Summary:\n").append(summary).append("\n\n");

        reportBuilder.append("Top 3 Ideas:\n\n");

        for (Vote vote : topThreeIdeas) {
            RoundPostIt postIt = vote.getRoundPostIt();
            String ideaContent = filterNumericContent(postIt.getContent());
            List<Comment> participantComments = commentRepository.findByRoundPostIt_Id(postIt.getId());

            reportBuilder.append("Idea: ").append(ideaContent).append("\n");
            reportBuilder.append("Participant Comments:\n");
            for (Comment comment : participantComments) {
                String filteredComment = filterNumericContent(comment.getContent());
                reportBuilder.append(" - ").append(filteredComment).append("\n");
            }
            reportBuilder.append("\n\n");
        }

        reportBuilder.append("Other Ideas:\n\n");
        for (Vote vote : remainingIdeas) {
            RoundPostIt postIt = vote.getRoundPostIt();
            String ideaContent = filterNumericContent(postIt.getContent());
            List<Comment> participantComments = commentRepository.findByRoundPostIt_Id(postIt.getId());

            reportBuilder.append("Idea: ").append(ideaContent).append("\n\n");
            reportBuilder.append("Participant Comments:\n");
            for (Comment comment : participantComments) {
                String filteredComment = filterNumericContent(comment.getContent());
                reportBuilder.append(" - ").append(filteredComment).append("\n");
            }
            reportBuilder.append("\n\n");
        }

        reportBuilder.append("Persona Analysis:\n").append(personaResult).append("\n\n");
        reportBuilder.append("SWOT Analysis:\n").append(swotResult).append("\n");

        return reportBuilder.toString();
    }

    // 코맨트 내부 숫자 및 공백 제거
    private String filterNumericContent(String content) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < content.length(); i++) {
            char currentChar = content.charAt(i);

            // 첫 글자가 숫자이거나, 마지막 글자가 숫자인 경우, 또는 숫자 좌우에 공백이 있는 경우
            if (Character.isDigit(currentChar) && (i == 0 || i == content.length() - 1 || Character.isWhitespace(content.charAt(i - 1)) || i < content.length() - 1 && Character.isWhitespace(content.charAt(i + 1)))) {
                continue;
            }

            builder.append(currentChar);
        }
        // 결과에서 양쪽 끝에 남아 있는 불필요한 공백을 제거
        return builder.toString().trim().replaceAll("\\s+", " ");
    }

}