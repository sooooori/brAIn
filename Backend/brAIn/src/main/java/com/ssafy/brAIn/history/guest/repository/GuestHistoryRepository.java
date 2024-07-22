package com.ssafy.brAIn.history.guest.repository;

import com.ssafy.brAIn.history.guest.entity.GuestHistory;
import com.ssafy.brAIn.history.guest.entity.GuestHistoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestHistoryRepository extends JpaRepository<GuestHistory, GuestHistoryId> {
}
