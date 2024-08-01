package com.ssafy.brAIn.comment.controller;

import com.ssafy.brAIn.comment.dto.CommentCreateRequest;
import com.ssafy.brAIn.comment.dto.CommentRequest;
import com.ssafy.brAIn.comment.entity.Comment;
import com.ssafy.brAIn.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/comment")
public class CommentController {

    private final CommentService commentService;

    // 코멘트 생성
    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestHeader("Authorization") String token,
                                           @RequestBody CommentCreateRequest commentCreateRequest) {
        String accessToken = token.replace("Bearer ", "");
        Integer roundPostItId = commentCreateRequest.getRoundPostItId();
        String content = commentCreateRequest.getContent();

        Comment comment = commentService.createComment(accessToken, roundPostItId, content);
        return ResponseEntity.ok(Map.of("Comment", comment, "message", "Comment created successfully"));
    }

    // 코멘트 수정
    @PutMapping("/update")
    public ResponseEntity<?> updateComment(@RequestHeader("Authorization") String token,
                                           @RequestBody CommentCreateRequest commentCreateRequest) {
        String accessToken = token.replace("Bearer ", "");
        Integer roundPostItId = commentCreateRequest.getRoundPostItId();
        String updateContent = commentCreateRequest.getContent();

        Comment comment = commentService.updateComment(accessToken, roundPostItId, updateContent);
        return ResponseEntity.ok(Map.of("UpdatedComment", comment, "message", "Comment created successfully"));
    }

    // 코멘트 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteComment(@RequestHeader("Authorization") String token,
                                           @RequestBody CommentRequest commentRequest) {
        String accessToken = token.replace("Bearer ", "");
        Integer roundPostItId = commentRequest.getRoundPostItId();
        Integer commentId = commentRequest.getCommentId();

        commentService.deleteComment(accessToken, roundPostItId, commentId);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
}
