package com.truong2k4.movie_service.modules.rating.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RatingResponse {
    UUID id;
    UUID userId;
    UUID movieId;
    Integer score;
    String review;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
