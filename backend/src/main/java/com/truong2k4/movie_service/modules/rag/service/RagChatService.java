package com.truong2k4.movie_service.modules.rag.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.truong2k4.movie_service.modules.rag.dto.request.ChatRequest;
import com.truong2k4.movie_service.modules.rag.dto.response.ChatResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Collections;
import java.util.UUID;

@Service
@Slf4j
public class RagChatService {

    private final String ragServiceUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public RagChatService(
            @Value("${rag.service.url:http://localhost:8000}") String ragServiceUrl
    ) {
        this.ragServiceUrl = ragServiceUrl;
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public ChatResponse chat(ChatRequest request) {
        String url = ragServiceUrl + "/rag/chat";
        log.info("Calling RAG service at: {} with payload: {}", url, request);
        try {
            String jsonPayload = objectMapper.writeValueAsString(request);
            log.info("Serialized JSON payload: {}", jsonPayload);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(20))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 422) {
                log.error("RAG service returned 422 validation error: {}", response.body());
                return buildFallbackResponse(request, "Dữ liệu trò chuyện không hợp lệ. Vui lòng thử lại!");
            }

            if (response.statusCode() != 200) {
                log.error("RAG service returned error status {}: {}", response.statusCode(), response.body());
                return buildFallbackResponse(request, "Hệ thống chatbot gặp sự cố (Mã " + response.statusCode() + "). Vui lòng thử lại sau!");
            }

            ChatResponse chatResponse = objectMapper.readValue(response.body(), ChatResponse.class);
            if (chatResponse == null) {
                log.warn("RAG service returned null response");
                return buildFallbackResponse(request, "Hệ thống chatbot không trả về kết quả. Vui lòng thử lại sau!");
            }
            return chatResponse;
        } catch (Exception e) {
            log.error("RAG service error: {}", e.getMessage(), e);
            return buildFallbackResponse(request, "Hệ thống chatbot gặp sự cố kết nối. Vui lòng thử lại sau!");
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
