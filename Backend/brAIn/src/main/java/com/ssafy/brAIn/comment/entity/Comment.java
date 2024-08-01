package com.ssafy.brAIn.comment.entity;

import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import jakarta.persistence.*;
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
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "roundpostit_id", referencedColumnName = "id")
    private RoundPostIt roundPostIt;

    @Column(name = "content")
    private String content;

    @Builder
    public Comment(Member member, RoundPostIt roundPostIt, String content) {
        this.member = member;
        this.roundPostIt = roundPostIt;
        this.content = content;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}