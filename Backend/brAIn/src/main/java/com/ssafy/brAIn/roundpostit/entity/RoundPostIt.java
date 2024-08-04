package com.ssafy.brAIn.roundpostit.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.vote.entity.Vote;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoundPostIt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private ConferenceRoom conferenceRoom;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member member;

    @Column(name = "content")
    private String content;

    private boolean last9;

    private boolean last3;

    private boolean isAI;

    @OneToMany(mappedBy = "roundPostIt", cascade = CascadeType.ALL)
    private List<Vote> votes;

    @Builder
    public RoundPostIt(String content, ConferenceRoom conferenceRoom,Member member) {
        this.content = content;
        this.conferenceRoom = conferenceRoom;
        this.member = member;
    }

    @Builder
    public RoundPostIt(String content) {
        this.content = content;
    }

    @Builder
    public RoundPostIt(boolean isAI, String content) {
        this.isAI = isAI;
        this.content = content;
    }

    public void selectedNine() {
        last9 = true;
    }

    public void selectedThree() {
        last3 = true;
    }

}
