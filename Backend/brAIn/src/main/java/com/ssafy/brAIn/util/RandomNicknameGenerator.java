package com.ssafy.brAIn.util;

import java.util.Random;

public class RandomNicknameGenerator {

    private static final String[] ADJECTIVES = {
            "화난", "온순한", "밥먹는", "빠른", "느린",
            "용감한",
            "겁많은",
            "웃는",
            "울고있는",
            "행복한",
            "졸린",
            "신나는",
            "지루한",
            "배고픈",
            "부끄러운",
            "피곤한",
            "활발한",
            "조용한",
            "냉정한",
            "고요한",
            "장난치는",
            "의심스러운",
            "무서운",
            "기운없는",
            "당황한",
            "울먹이는",
            "사랑스러운",
            "주눅든",
            "안절부절못하는",
            "안락한",
            "방긋 웃는",
            "애정 어린",
            "사나운",
            "편안한",
            "부주의한",
            "집중하는",
            "시끄러운",
            "경계하는",
            "느긋한",
            "우울한",
            "활기찬",
            "자랑스러운",
            "자상한",
            "호기심 많은",
            "걱정하는",
            "심술 궂은",
            "굶주린",
            "이기적인",
            "외로운"
    };

    private static final String[] ANIMALS = {
            "기린", "돌고래", "사자", "시바견", "원숭이", "코끼리", "호랑이"
    };

    private static final Random RANDOM = new Random();

    public static String generateNickname() {
        String adjective = ADJECTIVES[RANDOM.nextInt(ADJECTIVES.length)];
        String animal = ANIMALS[RANDOM.nextInt(ANIMALS.length)];
        return adjective + " " + animal;
    }
}