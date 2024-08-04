package com.ssafy.brAIn.vote.controller;

import com.ssafy.brAIn.vote.dto.VoteRequest;
import com.ssafy.brAIn.vote.dto.VoteResponse;
import com.ssafy.brAIn.vote.dto.VoteResultRequest;
import com.ssafy.brAIn.vote.service.VoteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/conferences/vote")
public class VoteController {

    private final VoteService voteService;

    // 투표 결정(진행)
    @PostMapping
    public ResponseEntity<String> vote(@RequestBody VoteRequest voteRequest) {
        voteService.vote(voteRequest.getRoomId(), voteRequest.getRound(), voteRequest.getMemberId(), voteRequest.getVotes());
        return new ResponseEntity<>("Vote successful", HttpStatus.OK);
    }

    // 타이머에 의해 투표 종료
    @PostMapping("/endByTimer")
    public ResponseEntity<?> endVoteByTimer(@RequestBody VoteResultRequest voteResultRequest) {
        voteService.endVoteByTimer(voteResultRequest);
        return new ResponseEntity<>("Vote Finished", HttpStatus.OK);
    }

    // 투표 결과 집계
    @GetMapping("/results")
    public ResponseEntity<List<VoteResponse>> voteResults(@RequestParam Integer roomId, @RequestParam Integer round) {
        List<VoteResponse> results = voteService.getVoteResults(roomId, round);
        return ResponseEntity.ok().body(results);
    }

    // 투표 결과 db 저장
    @PostMapping("/saveResults")
    public ResponseEntity<String> saveVoteResults(@RequestBody VoteResultRequest voteResultRequest) {
        List<VoteResponse> results = voteService.getVoteResults(voteResultRequest.getConferenceId(), voteResultRequest.getRound());
        voteService.saveTop9RoundResults(results, voteResultRequest);
        return new ResponseEntity<>("Vote results saved successfully", HttpStatus.OK);
    }

    // 투표 결과를을 담은 리스트를 소켓에 담아 메시지 보내기(예정) -> Message Controller
}
