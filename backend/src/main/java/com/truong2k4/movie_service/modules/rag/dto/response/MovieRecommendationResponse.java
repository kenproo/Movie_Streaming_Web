package com.truong2k4.movie_service.modules.rag.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieRecommendationResponse {
    UUID id;
    String title;
    String slug;
    String posterUrl;
    double rating;
    int year;
    String reason;
    double score;
}
