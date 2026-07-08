package com.truong2k4.movie_service.modules.rag.service;

import com.truong2k4.movie_service.modules.rag.dto.request.ChatRequest;
import com.truong2k4.movie_service.modules.rag.dto.response.ChatResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RagChatService {

    @NonFinal
    @Value("${rag.service.url:http://localhost:8000}")
    String ragServiceUrl;

    public ChatResponse chat(ChatRequest request) {
        String url = ragServiceUrl + "/rag/chat";
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.postForObject(url, request, ChatResponse.class);
        } catch (Exception e) {
            e.printStackTrace();
            return ChatResponse.builder()
                    .answer("Xin lỗi, hệ thống chatbot đang gặp sự cố kết nối tới RAG service. Vui lòng thử lại sau!")
                    .recommendations(java.util.Collections.emptyList())
                    .sessionId(request.getSessionId() != null ? request.getSessionId() : java.util.UUID.randomUUID().toString())
                    .build();
        }
    }
}
