package com.ssafy.brAIn.comment.service;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.comment.entity.Comment;
import com.ssafy.brAIn.comment.repository.CommentRepository;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import com.ssafy.brAIn.roundpostit.repository.RoundPostItRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final MemberRepository memberRepository;
    private final RoundPostItRepository roundPostItRepository;
    private final CommentRepository commentRepository;

    // 코멘트 생성
    public Comment createComment(String token, Integer roundPostItId, String content) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        RoundPostIt roundPostIt = roundPostItRepository.findById(roundPostItId)
                .orElseThrow(() -> new BadRequestException("RoundPostIt not found"));

        Comment comment = Comment.builder()
                .member(member)
                .roundPostIt(roundPostIt)
                .content(content)
                .build();

        commentRepository.save(comment);
        return comment;
    }

    // 코멘트 수정
    public Comment updateComment(String token, Integer commentId, String updateContent) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException("Comment not found"));

        // 댓글 작성자와 수정하려는 유저와 일치한지 확인
        if (!comment.getMember().equals(member)) {
            throw new BadRequestException("Unauthorized action");
        }

        comment.updateContent(updateContent);
        commentRepository.save(comment);
        return comment;
    }

    // 코멘트 삭제
    public void deleteComment(String token, Integer roundPostItId, Integer commentId) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        RoundPostIt roundPostIt = roundPostItRepository.findById(roundPostItId)
                .orElseThrow(() -> new BadRequestException("RoundPostIt not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException("Comment not found"));

        // 댓글 작성자와 삭제하려는 유저와 일치한지 확인
        if (!comment.getMember().equals(member)) {
            throw new BadRequestException("Unauthorized action");
        }

        // 댓글이 해당 라운드 포스트잇에 속하는지 확인
        if (!comment.getRoundPostIt().equals(roundPostIt)) {
            throw new BadRequestException("Comment does not belong to the specified RoundPostIt");
        }

        commentRepository.delete(comment);
    }
}