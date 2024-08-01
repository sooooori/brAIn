package com.ssafy.brAIn.comment.repository;

import com.ssafy.brAIn.comment.entity.Comment;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    // 특정 RoundPostIt에서 특정 Member가 작성한 모든 Comment 찾기
    List<Comment> findByRoundPostItAndMember(RoundPostIt roundPostIt, Member member);

}