package com.ssafy.brAIn.roundpostit.repository;

import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoundPostItRepository extends JpaRepository<RoundPostIt, Integer> {
    Optional<RoundPostIt> findByContentAndConferenceRoom_Id(String content, int conferenceRoomId);
}