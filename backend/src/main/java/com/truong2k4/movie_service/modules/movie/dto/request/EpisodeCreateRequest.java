package com.truong2k4.movie_service.modules.movie.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeCreateRequest {
    @NotNull
    @Min(1)
    Integer episodeNumber;
    String title;
    String videoUrl;
    String summary;
    String duration;
    String thumbnailUrl;
    LocalDateTime releasedAt;
}
