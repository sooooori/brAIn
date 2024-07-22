package com.ssafy.brAIn.guest.servcie;

import com.ssafy.brAIn.guest.dto.GuestDto;
import com.ssafy.brAIn.guest.entity.Guest;
import com.ssafy.brAIn.guest.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GuestService {

    private final GuestRepository guestRepository;

    public Guest save(Guest guest) {
        return guestRepository.save(guest);
    }
}
