package com.truong2k4.movie_service.modules.movie.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeUpdateRequest {
    Integer episodeNumber;
    Integer seasonNumber;
    String title;
    String summary;

    String duration;
    String thumbnailUrl;
    LocalDateTime releasedAt;
}
