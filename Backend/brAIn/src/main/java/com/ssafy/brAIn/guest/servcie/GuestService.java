package com.ssafy.brAIn.guest.servcie;

import com.ssafy.brAIn.guest.entity.Guest;
import com.ssafy.brAIn.guest.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GuestService {

    @Autowired
    private final GuestRepository guestRepository;

    public Guest save(Guest guest) {
        return guestRepository.save(guest);
    }
}
