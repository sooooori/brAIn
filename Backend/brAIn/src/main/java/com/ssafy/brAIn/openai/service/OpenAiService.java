package com.ssafy.brAIn.openai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@NoArgsConstructor
public class OpenAiService {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    //private static final String API_URL = "http://example.com/api/endpoint"; // API 엔드포인트 URL

    public static Map<String, Object> sendPostRequest(String subject) {
        try {
            URL url = new URL("http://127.0.0.1:5000/thread/start");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Accept", "application/json");
            con.setDoOutput(true);

            // 요청 본문을 Map으로 생성
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("subject", subject);

            // Map을 JSON 문자열로 변환
            String jsonInputString = objectMapper.writeValueAsString(requestBody);

            // 요청 본문 쓰기
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            // 응답 받기
            StringBuilder response = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }

            // JSON 문자열을 Map으로 변환
            return objectMapper.readValue(response.toString(), Map.class);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }
}
