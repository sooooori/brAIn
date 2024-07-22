package com.ssafy.brAIn.ConferenceRoom.repository;

import com.ssafy.brAIn.ConferenceRoom.entity.ConferenceRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConferenceRoomRepository extends JpaRepository<ConferenceRoom, Integer> {
}