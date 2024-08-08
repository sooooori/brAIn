package com.ssafy.brAIn.stomp.dto;

public enum MessageType {
    ENTER,EXIT,TALK,
    ENTER_WAITING_ROOM,
    EXIT_WAITING_ROOM,
    ENTER_CONFERENCES,
    EXIT_CONFERENCES,
    NEXT_STEP,
    SUBMIT_POST_IT,
    SUBMIT_POST_IT_AND_END,
    PASS_AND_END,
    NEXT_ROUND,
    START_CONFERENCE,
    PLUS_TIME,
    FINISH_MIDDLE_VOTE, // 중간 투표 종료 : 상위 9개 선정
    FINISH_FINAL_VOTE, // 중간 투표 종료 : 상위 3개 선정
    START_VOTE,
    END_CONFERENCE,
    READY,PASS,SUBMIT,NONE;;
}
