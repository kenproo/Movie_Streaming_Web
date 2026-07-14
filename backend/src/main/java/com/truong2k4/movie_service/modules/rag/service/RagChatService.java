package com.truong2k4.movie_service.modules.rag.service;

import com.truong2k4.movie_service.modules.rag.dto.request.ChatRequest;
import com.truong2k4.movie_service.modules.rag.dto.response.ChatResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Collections;
import java.util.UUID;

@Service
@Slf4j
public class RagChatService {

    private final RestTemplate restTemplate;
    private final String ragServiceUrl;

    public RagChatService(
            RestTemplateBuilder restTemplateBuilder,
            @Value("${rag.service.url:http://localhost:8000}") String ragServiceUrl,
            @Value("${rag.service.timeout-seconds:20}") int timeoutSeconds
    ) {
        this.ragServiceUrl = ragServiceUrl;
        this.restTemplate = restTemplateBuilder
                .connectTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(timeoutSeconds))
                .build();
    }

    public ChatResponse chat(ChatRequest request) {
        String url = ragServiceUrl + "/rag/chat";
        log.info("Calling RAG service at: {} with payload: {}", url, request);
        try {
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            org.springframework.http.HttpEntity<ChatRequest> entity = new org.springframework.http.HttpEntity<>(request, headers);
            ChatResponse response = restTemplate.postForObject(url, entity, ChatResponse.class);
            if (response == null) {
                log.warn("RAG service returned null response");
                return buildFallbackResponse(request, "Hệ thống chatbot không trả về kết quả. Vui lòng thử lại sau!");
            }
            return response;
        } catch (ResourceAccessException e) {
            log.warn("RAG service unavailable: {}", e.getMessage());
            return buildFallbackResponse(request, "Hệ thống chatbot đang tạm thời không khả dụng. Vui lòng thử lại sau!");
        } catch (Exception e) {
            log.error("RAG service error: {}", e.getMessage());
            return buildFallbackResponse(request, "Hệ thống chatbot gặp sự cố. Vui lòng thử lại sau!");
        }
    }

    private ChatResponse buildFallbackResponse(ChatRequest request, String message) {
        return ChatResponse.builder()
                .answer(message)
                .recommendations(Collections.emptyList())
                .sessionId(request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString())
                .build();
    }
}
