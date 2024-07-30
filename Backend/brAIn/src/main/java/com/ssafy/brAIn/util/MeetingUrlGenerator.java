package com.ssafy.brAIn.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

public class MeetingUrlGenerator {

    // 고유한 SHA-256 해시 생성 메서드
    private static String generateSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    // 바이트 배열을 16진수 문자열로 변환하는 메서드
    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    // 회의 방 URL 생성 메서드
    public static String generateMeetingUrl() {
        // UUID를 사용하여 고유 ID 생성
        String uniqueId = UUID.randomUUID().toString();

        // SHA-256 해시 생성
        String secureId = generateSHA256(uniqueId);

        // URL 생성
        //String meetingUrl = String.format("https://bardisue.store/v1/conferences/%s", secureId);

        return secureId;
    }

    public static void main(String[] args) {
        String meetingUrl = generateMeetingUrl();
        System.out.println("Generated Meeting URL: " + meetingUrl);
    }
}
