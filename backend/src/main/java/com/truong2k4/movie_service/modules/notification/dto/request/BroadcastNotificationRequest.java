package com.truong2k4.movie_service.modules.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BroadcastNotificationRequest {
    @NotBlank
    String title;
    @NotBlank
    String content;
    String targetUrl;
}
