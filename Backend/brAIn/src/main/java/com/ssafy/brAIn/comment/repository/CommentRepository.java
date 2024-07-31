package com.ssafy.brAIn.comment.repository;

import com.ssafy.brAIn.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
}
