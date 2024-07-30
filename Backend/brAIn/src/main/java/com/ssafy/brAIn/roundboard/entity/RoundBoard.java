package com.ssafy.brAIn.roundboard.entity;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoundBoard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private ConferenceRoom conferenceRoom;

    @Column(name = "current_round")
    private int currentRound;

    @Builder
    public RoundBoard(ConferenceRoom conferenceRoom, int currentRound) {
        this.conferenceRoom=conferenceRoom;
        this.currentRound=currentRound;
    }
    
}
