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

    // 투표 종료 -> 타이머 종료
//    @PostMapping("/endByTimer")
//    public ResponseEntity<?> endVoteByTimer(@RequestParam Integer conferenceRoomId) {
//        voteService.endVoteByTimer(conferenceRoomId);
//        return ResponseEntity.ok().build();
//    }
//
//
//    // 투표 종료 -> 사용자 전원이 투표하면 자동 종료
//    @GetMapping("/endByUsers")
//    public ResponseEntity<?> endVoteByUsers(@RequestParam Integer conferenceRoomId) {
//        voteService.endVoteByUsers(conferenceRoomId);
//        return ResponseEntity.ok().build();
//    }


    // 투표 결정(진행)
    @PostMapping
    public ResponseEntity<String> vote(@RequestBody VoteRequest voteRequest) {
        voteService.vote(voteRequest.getRoomId(), voteRequest.getRound(), voteRequest.getVotes());
        return new ResponseEntity<>("Vote successful", HttpStatus.OK);
    }

    // 투표 결과 집계
    @GetMapping("/results")
    public ResponseEntity<List<VoteResponse>> voteResults(@RequestBody VoteResultRequest voteResultRequest) {
        List<VoteResponse> results = voteService.getVoteResults(voteResultRequest);
        return ResponseEntity.ok().body(results);
    }

    // 투표 결과 db 저장
    @PostMapping("/saveResults")
    public ResponseEntity<String> saveVoteResults(@RequestBody VoteResultRequest voteResultRequest) {
        List<VoteResponse> results = voteService.getVoteResults(voteResultRequest);
        voteService.saveTop9RoundResults(results, voteResultRequest);
        return new ResponseEntity<>("Vote results saved successfully", HttpStatus.OK);
    }

    // 투표 결과를을 담은 리스트를 소켓에 담아 메시지 보내기(예정)
}
