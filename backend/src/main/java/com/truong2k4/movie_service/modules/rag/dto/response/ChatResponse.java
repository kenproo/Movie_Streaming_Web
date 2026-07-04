package com.truong2k4.movie_service.modules.rag.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatResponse {
    String answer;
    List<MovieRecommendationResponse> recommendations;
    String sessionId;
}
