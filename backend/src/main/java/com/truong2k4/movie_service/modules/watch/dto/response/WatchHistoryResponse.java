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
public class WatchHistoryResponse {
    UUID id;
    UUID movieId;
    int episodeNumber;
    LocalDateTime watchedAt;
}
