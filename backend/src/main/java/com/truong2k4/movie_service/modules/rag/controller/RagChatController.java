package com.truong2k4.movie_service.modules.rag.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.rag.dto.request.ChatRequest;
import com.truong2k4.movie_service.modules.rag.dto.response.ChatResponse;
import com.truong2k4.movie_service.modules.rag.service.RagChatService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/rag", "/chatbot"})
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RagChatController {

    RagChatService ragChatService;

    @PostMapping("/chat")
    public ApiResponse<ChatResponse> chat(@RequestBody @Valid ChatRequest request) {
        return ApiResponse.<ChatResponse>builder()
                .result(ragChatService.chat(request))
                .build();
    }
}
