package com.truong2k4.movie_service.modules.movie.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeResponse {
    UUID id;
    int episodeNumber;
    Integer seasonNumber;
    String title;
    String summary;
    String duration;
    String thumbnailUrl;
    String videoUrl;
    LocalDateTime releasedAt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
