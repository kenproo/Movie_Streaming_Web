package com.truong2k4.movie_service.common.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ErrorResponse {
    @Builder.Default
    boolean success = false;
    String message;
    String errorCode;
    int status;
    String path;
    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now();
}
