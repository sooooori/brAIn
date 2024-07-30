package com.ssafy.brAIn.roundpostit.repository;

import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoundPostItRepository extends JpaRepository<RoundPostIt, Integer> {

}