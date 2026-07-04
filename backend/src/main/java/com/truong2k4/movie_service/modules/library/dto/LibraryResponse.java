package com.truong2k4.movie_service.modules.library.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LibraryResponse {
    List<String> favorites;
    List<String> follows;
    List<WatchHistoryItem> history;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class WatchHistoryItem {
        String movieId;
        int episodeNumber;
        LocalDateTime watchedAt;
    }
}
