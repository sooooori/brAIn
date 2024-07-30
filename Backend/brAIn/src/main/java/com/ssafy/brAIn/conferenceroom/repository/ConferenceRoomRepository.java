package com.ssafy.brAIn.conferenceroom.repository;

import com.ssafy.brAIn.conferenceroom.entity.ConferenceRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConferenceRoomRepository extends JpaRepository<ConferenceRoom, Integer> {
}