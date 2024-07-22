package com.ssafy.brAIn.alert.service;

import com.ssafy.brAIn.alert.entity.Alert;
import com.ssafy.brAIn.alert.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;

    public Alert save(Alert alert) {
        return alertRepository.save(alert);
    }
}
