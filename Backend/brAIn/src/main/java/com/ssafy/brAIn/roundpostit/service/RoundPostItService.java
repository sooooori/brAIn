package com.ssafy.brAIn.roundpostit.service;

import com.ssafy.brAIn.roundpostit.entity.RoundPostIt;
import com.ssafy.brAIn.roundpostit.repository.RoundPostItRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Queue;

@Service
public class RoundPostItService {

    private final Queue<RoundPostIt> postItQueue;
    private final RoundPostItRepository roundPostItRepository;

    public RoundPostItService(RoundPostItRepository roundPostItRepository) {
        this.postItQueue = new LinkedList<>();
        this.roundPostItRepository = roundPostItRepository;
    }

    // 초기화 시 RoundPostIt들을 큐에 추가
    public void initializeQueue(List<RoundPostIt> roundPostIts) {
        this.postItQueue.clear();
        this.postItQueue.addAll(roundPostIts);
    }

    // 다음 RoundPostIt 가져오기
    public RoundPostIt getNextRoundPostIt() {
        return postItQueue.poll(); // 큐에서 다음 PostIt을 꺼냄
    }

    // 큐가 비었는지 확인
    public boolean isEmpty() {
        return postItQueue.isEmpty();
    }

    // 현재 RoundPostIt 가져오기 (큐의 첫 번째 요소를 반환하지만 제거하지 않음)
    public RoundPostIt peekCurrentRoundPostIt() {
        return postItQueue.peek();
    }


    public Optional<RoundPostIt> findByContent(String content) {
        return roundPostItRepository.findByContent(content);
    }

    public Optional<RoundPostIt> findByContentAndRoom(String content, String room) {
        return roundPostItRepository.findByContentAndConferenceRoom_Id(content,Integer.parseInt(room));
    }

    public List<RoundPostIt> findByRoomId(Integer roomId) {
        return roundPostItRepository.findByConferenceRoom_Id(roomId);
    }
}
