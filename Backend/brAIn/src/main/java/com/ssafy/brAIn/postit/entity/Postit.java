package com.ssafy.brAIn.postit.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Postit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String content;

    @ManyToOne
    @JoinColumn(name="room_id", referencedColumnName = "id")
    private ConferenceRoom room;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member member;

    @ManyToOne
    @JoinColumn(name="guest_id", referencedColumnName = "id")
    private Guest guest;


    @Builder
    public Postit(String content,ConferenceRoom room, Member member) {
        this.content = content;
        this.room = room;
        this.member = member;

    }

    @Builder
    public Postit(String content,ConferenceRoom room, Guest guest) {
        this.content = content;
        this.room = room;
        this.guest=guest;
    }


}
