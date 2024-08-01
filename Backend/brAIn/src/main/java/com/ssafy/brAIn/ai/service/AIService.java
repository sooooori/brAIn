package com.ssafy.brAIn.ai.service;

import com.ssafy.brAIn.ai.response.AIAssistant;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    private final WebClient webClient;

    public AIService(WebClient webClient) {
        this.webClient = webClient;
    }

    public AIAssistant makeAIAssistant(String subject) {
        String url="/thread/start";

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("subject", subject);

        return webClient
                .post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve().bodyToMono(AIAssistant.class)
                .block();
    }

    public String addPostIt(String content, String threadId) {
        String url="/postIt/add";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("postIt", content);
        requestBody.put("threadId", threadId);

        return webClient
                .post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve().bodyToMono(String.class)
                .block();
    }
}
