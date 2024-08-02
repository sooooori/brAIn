package com.ssafy.brAIn.vote.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import com.ssafy.brAIn.vote.dto.VoteRequest;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private ConferenceRoom conferenceRoom;

    @ManyToOne
    @JoinColumn(name = "postit_id", referencedColumnName = "id")
    private RoundPostIt roundPostIt;

//    @ManyToOne
//    @JoinColumn(name = "member_id", referencedColumnName = "id")
//    private Member member;

    @Column(name = "score")
    private int score;

    @Column(name = "vote_type")
    @Enumerated(value = EnumType.STRING)
    private VoteType voteType;

    @Builder
    private Vote(int score, VoteType voteType, ConferenceRoom conferenceRoom, RoundPostIt roundPostIt, Member member) {
        this.score = score;
        this.voteType = voteType;

        this.conferenceRoom = conferenceRoom;
        this.roundPostIt = roundPostIt;
//        this.member = member;
    }

}
