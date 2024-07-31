package com.ssafy.brAIn.roundboard.repository;

import com.ssafy.brAIn.roundboard.entity.RoundBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoundBoardRepository extends JpaRepository<RoundBoard, Integer> {
}