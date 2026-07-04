package com.truong2k4.movie_service.modules.notification.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    UUID id;
    String type;
    String title;
    String message;
    boolean read;
    String targetUrl;
    LocalDateTime createdAt;
}
