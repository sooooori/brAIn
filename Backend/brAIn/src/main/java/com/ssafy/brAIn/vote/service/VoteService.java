package com.ssafy.brAIn.vote.service;

import com.ssafy.brAIn.conferenceroom.repository.ConferenceRoomRepository;
import com.ssafy.brAIn.history.repository.MemberHistoryRepository;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.roundpostit.repository.RoundPostItRepository;
import com.ssafy.brAIn.util.RedisUtils;
import com.ssafy.brAIn.vote.dto.VoteResponse;
import com.ssafy.brAIn.vote.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class VoteService {
    private final VoteRepository voteRepository;
    private final RoundPostItRepository roundPostItRepository;
    private final MemberRepository memberRepository;
    private final ConferenceRoomRepository conferenceRoomRepository;
    private final MemberHistoryRepository memberHistoryRepository;

    private final RedisUtils redisUtils;

    // 투표 진행
    @Transactional
    public void vote(Integer roomId, Integer round, Map<String, Integer> votes) {
        String key = roomId + ":" + round;
        List<Object> postIts = redisUtils.getListFromKey(key);

        // key for storing votes
        String voteKey = roomId + ":votes:" + round;

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
    @Transactional
    public List<VoteResponse> getVoteResults(int conferenceRoomId) {
        String voteKeyPattern = conferenceRoomId + ":votes:*";
        Set<String> keys = redisUtils.keys(voteKeyPattern);
        log.info("key: {}", keys);

        List<VoteResponse> result = keys.stream()
                .flatMap(key -> redisUtils.getSortedSetWithScores(key).stream())
                .sorted((v1, v2) -> Integer.compare(v2.getScore(), v1.getScore()))
                .limit(9)
                .collect(Collectors.toList());

        log.info("result: {}", result);
        return result;
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

    // 투표 결과를 DB에 저장
//    @Transactional
//    public void saveVoteResults(Integer conferenceRoomId) {
//        List<VoteResponse> results = getVoteResults(conferenceRoomId);
//
//        results.forEach(result -> {
//            RoundPostItRedis postItRedis = roundPostItRedisRepository.findById(String.valueOf(result.getPostItId()))
//                    .orElseThrow(() -> new IllegalArgumentException("Invalid post-it ID: " + result.getPostItId()));
//
//            MemberHistory memberHistory = memberHistoryRepository.findByMemberIdAndConferenceRoomId(postItRedis.getConferenceId(), conferenceRoomId)
//                    .orElseThrow(() -> new IllegalArgumentException("Invalid member history for room ID: " + conferenceRoomId + " and member ID: " + postItRedis.getConferenceId()));
//
//            Member member = memberHistory.getMember();
//
//            RoundPostIt roundPostIt = RoundPostIt.builder()
//                    .member(member)
//                    .content(postItRedis.getMessage())
//                    .conferenceRoom(conferenceRoomRepository.findById(postItRedis.getConferenceId())
//                            .orElseThrow(() -> new IllegalArgumentException("Invalid conference room ID: " + postItRedis.getConferenceId())))
//                    .build();
//
//            roundPostIt.selectedNine();
//            roundPostItRepository.save(roundPostIt);
//
//            // 각 포스트잇에 대한 결과 저장
//            Vote vote = Vote.builder()
//                    .conferenceRoom(conferenceRoomRepository.findById(postItRedis.getConferenceId())
//                            .orElseThrow(() -> new IllegalArgumentException("Invalid conference room ID: " + postItRedis.getConferenceId())))
//                    .roundPostIt(roundPostIt)
//                    .member(member)
//                    .score(result.getTotalScore())
//                    .voteType(VoteType.FINAL)
//                    .build();
//
//            voteRepository.save(vote);
//        });
//    }
}
