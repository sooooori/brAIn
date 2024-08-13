package com.ssafy.brAIn.vote.repository;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import com.ssafy.brAIn.vote.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Integer> {
    Optional<Vote> findByRoundPostItAndConferenceRoom(RoundPostIt roundPostIt, ConferenceRoom conferenceRoom);
    List<Vote> findByConferenceRoom_Id(Integer roomId);

    boolean existsByConferenceRoomId(Integer conferenceRoomId);
}
