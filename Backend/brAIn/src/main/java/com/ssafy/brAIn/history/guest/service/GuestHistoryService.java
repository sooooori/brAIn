package com.ssafy.brAIn.history.guest.service;

import com.ssafy.brAIn.history.guest.entity.GuestHistory;
import com.ssafy.brAIn.history.guest.repository.GuestHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GuestHistoryService {
    private final GuestHistoryRepository guestHistoryRepository;

    public GuestHistory save(GuestHistory guestHistory) {
        return guestHistoryRepository.save(guestHistory);
    }
}
