package com.ssafy.brAIn.comment.service;

import com.ssafy.brAIn.comment.entity.Comment;
import com.ssafy.brAIn.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }
}