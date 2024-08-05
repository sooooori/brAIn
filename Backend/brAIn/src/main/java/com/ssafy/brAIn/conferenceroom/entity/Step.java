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

    public Step next() {
        switch (this) {
            case STEP_0:
                return STEP_1;
            case STEP_1:
                return STEP_2;
            case STEP_2:
                return STEP_3;
            case STEP_3:
                return STEP_4;
            case STEP_4:
                return STEP_5;
            case STEP_5:
                return STEP_5; // 마지막 단계에서는 자기 자신을 반환
            default:
                throw new IllegalArgumentException("Unknown step: " + this);
        }
    }
}
