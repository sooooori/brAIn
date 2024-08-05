package com.ssafy.brAIn.stomp.response;

import com.ssafy.brAIn.stomp.dto.MessageType;
import com.ssafy.brAIn.vote.dto.VoteResponse;
import com.ssafy.brAIn.vote.entity.Vote;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ResponseMiddleVote {
    private MessageType type;
    private List<VoteResponse> votes;

    public ResponseMiddleVote(MessageType type, List<VoteResponse> votes) {
        this.type = type;
        this.votes = votes;
    }
}
