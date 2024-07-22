package com.ssafy.brAIn.roundpostit.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoundPostIt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

//    @ManyToOne
//    @JoinColumn(name = "round_board_id", referencedColumnName = "id")
//    private RoundBoard roundBoard;
//
//    @ManyToOne
//    @JoinColumn(name = "member_id", referencedColumnName = "id")
//    private Member member;
//
//    @ManyToOne
//    @JoinColumn(name = "guest_id", referencedColumnName = "id")
//    private Guest guest;
//
//    @Column(name = "content")
//    private String content;
//
//    private boolean last9;
//
//    private boolean last3;
//
//    private boolean isAI;
//
//    @Builder
//    public RoundPostIt(RoundBoard roundBoard, Member member, String content) {
//        this.roundBoard = roundBoard;
//        this.member = member;
//        this.content = content;
//    }
//
//    @Builder
//    public RoundPostIt(RoundBoard roundBoard, Guest guest, String content) {
//        this.roundBoard = roundBoard;
//        this.guest = guest;
//        this.content = content;
//    }
//
//    @Builder
//    public RoundPostIt(RoundBoard roundBoard, boolean isAI, String content) {
//        this.roundBoard = roundBoard;
//        this.isAI = isAI;
//        this.content = content;
//    }

//    public void selectedNine() {
//        last9 = true;
//    }
//
//    public void selectedThree() {
//        last3 = true;
//    }


}
