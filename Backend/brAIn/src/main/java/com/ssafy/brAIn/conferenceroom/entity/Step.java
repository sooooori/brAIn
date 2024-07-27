package com.ssafy.brAIn.conferenceroom.entity;

public enum Step {
    STEP_0(0), STEP_1(1), STEP_2(2), STEP_3(3), STEP_4(4), STEP_5(5);

    private final int value;

    Step(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
