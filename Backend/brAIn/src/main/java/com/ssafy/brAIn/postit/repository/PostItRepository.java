package com.ssafy.brAIn.postit.repository;


import com.ssafy.brAIn.postit.entity.PostIt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostItRepository extends JpaRepository<PostIt, Integer> {
}
