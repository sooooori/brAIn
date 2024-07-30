package com.ssafy.brAIn.comment.entity;

import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.postit.entity.PostIt;
import jakarta.persistence.*;
import jakarta.persistence.criteria.Root;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "postit_id", referencedColumnName = "id")
    private PostIt postIt;

    @Column(name = "content")
    private String content;

    // 비회원 보류

    @Builder
    public Comment(Integer id, Member member, PostIt postIt, String content) {
        this.id = id;
        this.member = member;
        this.postIt = postIt;
        this.content = content;
    }
}