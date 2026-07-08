package com.truong2k4.movie_service.modules.watch.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WatchProgressResponse {
    UUID id;
    UUID movieId;
    UUID episodeId;
    int episodeNumber;
    int progressSeconds;
    int durationSeconds;
    double progressPercent;
    LocalDateTime updatedAt;
}
