package com.ssafy.brAIn.conferenceroom.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ConferenceUpdateRequest {

    private String subject;
    private Date startTime;

}
