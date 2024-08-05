package com.ssafy.brAIn.postit.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostIt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    @ManyToOne
    @JoinColumn(name="room_id", referencedColumnName = "id")
    private ConferenceRoom room;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member member;


    @Builder
    public PostIt(String content, ConferenceRoom room, Member member) {
        this.content = content;
        this.room = room;
        this.member = member;

    }

    @Builder
    public PostIt(String content, ConferenceRoom room) {
        this.content = content;
        this.room = room;
    }


}
