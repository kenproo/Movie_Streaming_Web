package com.truong2k4.movie_service.modules.analytics.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccessLogResponse {
    UUID id;
    UUID userId;
    UUID movieId;
    String page;
    String action;
    String keyword;
    LocalDateTime createdAt;
}
