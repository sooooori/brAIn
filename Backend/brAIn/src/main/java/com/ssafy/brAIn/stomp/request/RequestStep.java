package com.ssafy.brAIn.stomp.request;

import com.ssafy.brAIn.conferenceroom.entity.Step;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestStep {

    private Step step;


    public RequestStep(Step step) {
        this.step = step;
    }

}
