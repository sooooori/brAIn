package com.ssafy.brAIn.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CommentRequest {

    private Integer memberId;
    private Integer commentId;
    private String comment;

}
