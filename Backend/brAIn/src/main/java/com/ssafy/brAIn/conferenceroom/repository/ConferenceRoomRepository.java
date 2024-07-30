package com.ssafy.brAIn.conferenceroom.repository;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConferenceRoomRepository extends JpaRepository<ConferenceRoom, Integer> {
    Optional<ConferenceRoom> findByInviteCode(String inviteCode);
}