package com.ssafy.brAIn.vote.service;

import com.ssafy.brAIn.vote.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class VoteService {

    private final VoteRepository voteRepository;
}
