package com.ssafy.brAIn.vote.service;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.exception.GlobalExceptionHandler;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import com.ssafy.brAIn.roundpostit.repository.RoundPostItRepository;
import com.ssafy.brAIn.util.RedisUtils;
import com.ssafy.brAIn.vote.dto.VoteResponse;
import com.ssafy.brAIn.vote.dto.VoteResultRequest;
import com.ssafy.brAIn.vote.entity.Vote;
import com.ssafy.brAIn.vote.entity.VoteType;
import com.ssafy.brAIn.vote.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ServerErrorException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class VoteService {
    private final VoteRepository voteRepository;
    private final RoundPostItRepository roundPostItRepository;
    private final ConferenceRoomRepository conferenceRoomRepository;

    private final RedisUtils redisUtils;

    // 투표 진행
    @Transactional
    public void vote(Integer roomId, Integer round, Map<String, Integer> votes) {
        String key = roomId + ":" + round;
        List<Object> postIts = redisUtils.getListFromKey(key);

        // key for storing votes
        String voteKey = roomId + ":votes:" + round;

        // 1점, 3점 ,5점 부여
        int score1Point = 0;
        int score3Point = 0;
        int score5Point = 0;
        for (Map.Entry<String, Integer> vote : votes.entrySet()) {
            Integer score = vote.getValue();
            if (score == 1) {
                score1Point++;
            } else if (score == 3) {
                score3Point++;
            } else if (score == 5) {
                score5Point++;
            } else {
                throw new IllegalArgumentException("Invalid score value: " + score);
            }
        }

        // 한번만 선택되어야 함
        if (score1Point > 1 || score3Point > 1 || score5Point > 1) {
            throw new IllegalArgumentException("Each score (1, 3, 5) can only be used once.");
        }


        // Apply votes to scores, but only for existing post-its
        for (Map.Entry<String, Integer> vote : votes.entrySet()) {
            String postIt = vote.getKey();
            Integer score = vote.getValue();

            if (postIts.contains(postIt)) {
                redisUtils.incrementSortedSetScore(voteKey, score, postIt);
            } else {
                System.out.println("Post-it not found: " + postIt);
            }
        }
    }

    // 전체 결과를 보여줌 (상위 9개)
    @Transactional(readOnly = true)
    public List<VoteResponse> getVoteResults(VoteResultRequest voteResultRequest) {
        String key = voteResultRequest.getConferenceId() + ":votes:" + voteResultRequest.getRound();

        return redisUtils.getSortedSetWithScores(key)
                .stream()
                .map(tuple -> new VoteResponse(tuple.getPostIt(), tuple.getScore()))
                .sorted((v1,v2)->Integer.compare(v2.getScore(),v1.getScore()))
                .limit(9)
                .collect(Collectors.toList());
    }

    // 투표 결과를 DB에 저장
    @Transactional
    public void saveTop9RoundResults(List<VoteResponse> votes, VoteResultRequest voteResultRequest) throws ServerErrorException {
        ConferenceRoom conferenceRoom = conferenceRoomRepository.findById(voteResultRequest.getConferenceId())
                .orElseThrow(() -> new IllegalArgumentException("잘못된 회의실 ID"));

        for (VoteResponse voteResponse : votes) {
            RoundPostIt roundPostIt = roundPostItRepository.findByContentAndConferenceRoom_Id(voteResponse.getPostIt(), voteResultRequest.getConferenceId())
                    .orElseGet(() -> {
                        log.info("Creating new RoundPostIt for content: {}", voteResponse.getPostIt());
                        return roundPostItRepository.save(
                                RoundPostIt.builder()
                                        .content(voteResponse.getPostIt())
                                        .conferenceRoom(conferenceRoom)
                                        .build()
                        );
                    });

            roundPostIt.selectedNine();
            roundPostItRepository.save(roundPostIt);

            Optional<Vote> existingVote = voteRepository.findByRoundPostItAndConferenceRoom(roundPostIt, conferenceRoom);

            // 이미 있는 투표 기록이면 반영하지 않음
            if (existingVote.isEmpty()) {
                Vote vote = Vote.builder()
                        .score(voteResponse.getScore())
                        .voteType(VoteType.MIDDLE)
                        .conferenceRoom(conferenceRoom)
                        .roundPostIt(roundPostIt)
                        .build();
                voteRepository.save(vote);
            }
            else{
                throw new BadRequestException("중복된 투표입니다.");
            }
        }
    }


//    // 타이머에 의한 투표 종료
//    @Transactional
//    public void endVoteByTimer(Integer conferenceRoomId) {
//        ConferenceRoom room = conferenceRoomRepository.findById(conferenceRoomId)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid conferenceRoom ID"));
//
//        if (room.isTimerExpired()) {
//            room.updateStep(Step.STEP_3);
//            conferenceRoomRepository.save(room);
//            saveVoteResults(conferenceRoomId);
//        }
//    }
//
//    // 모든 참가자들이 투표를 완료함
//    @Transactional
//    public void endVoteByUsers(Integer conferenceRoomId) {
//        ConferenceRoom room = conferenceRoomRepository.findById(conferenceRoomId)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid conferenceRoom ID"));
//
//        int totalMembers = memberHistoryRepository.countByConferenceRoomId(conferenceRoomId);
//        int totalVotes = voteRepository.countByConferenceRoomId(conferenceRoomId);
//
//        if (totalMembers * 3 == totalVotes) {
//            room.updateStep(Step.STEP_3);
//            conferenceRoomRepository.save(room);
//            saveVoteResults(conferenceRoomId);
//        }
//    }
}
