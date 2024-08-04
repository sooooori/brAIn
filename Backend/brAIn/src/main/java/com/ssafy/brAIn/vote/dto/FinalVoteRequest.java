package com.ssafy.brAIn.vote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FinalVoteRequest {
    private int roomId;
    private int round;
    private int memberId;
    private String postIt;
}
