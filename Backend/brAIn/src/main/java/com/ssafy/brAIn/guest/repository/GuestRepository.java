package com.ssafy.brAIn.guest.repository;

import com.ssafy.brAIn.guest.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Integer> {
//    Guest findByGuest(String name);
}
