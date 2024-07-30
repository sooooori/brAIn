package com.ssafy.brAIn.util;

import java.util.Random;

public class RandomNicknameGenerator {
    
    private static final String[] ADJECTIVES = {
        "화난", "온순한", "밥먹는", "빠른", "느린", "용감한", "겁많은", "웃는", "울고있는", "행복한"
    };

    private static final String[] ANIMALS = {
        "공룡", "비둘기", "하마", "사자", "호랑이", "토끼", "거북이", "고양이", "강아지", "코끼리",
        "판다", "코알라", "침팬지", "다람쥐", "여우", "늑대", "원숭이", "타조", "코뿔소", "기린",
        "하이에나", "수달", "오소리", "두더지", "참새", "매", "독수리", "올빼미", "거위", "타조",
        "캥거루", "라쿤", "야크", "이구아나", "앵무새", "돌고래", "상어", "문어", "해파리", "게",
        "불가사리", "말미잘", "해마", "고래", "해달", "바다사자", "바다표범", "북극곰", "펭귄",
        "칠면조", "부엉이", "까마귀", "까치", "고슴도치", "담비", "스컹크", "페릿", "친칠라",
        "퓨마", "재규어", "치타", "표범", "재두루미", "홍학", "가젤", "들소", "영양", "카멜레온",
        "도마뱀", "뱀", "거북", "악어", "두꺼비", "개구리", "펠리컨", "펭귄", "갈매기", "백조",
        "두루미", "황새", "앵무새", "까마귀", "까치", "참새", "제비", "참새", "오리", "닭", "오골계"
    };

    private static final Random RANDOM = new Random();

    public static String generateNickname() {
        String adjective = ADJECTIVES[RANDOM.nextInt(ADJECTIVES.length)];
        String animal = ANIMALS[RANDOM.nextInt(ANIMALS.length)];
        return adjective + " " + animal;
    }
}