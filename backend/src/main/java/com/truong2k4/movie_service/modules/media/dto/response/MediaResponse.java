package com.truong2k4.movie_service.modules.media.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaResponse {
    String id;
    String fileName;
    String mediaType;
    String url;
    String contentType;
    Long fileSize;
    LocalDateTime uploadedAt;
}
