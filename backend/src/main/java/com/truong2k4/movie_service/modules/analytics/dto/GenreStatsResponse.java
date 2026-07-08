package com.truong2k4.movie_service.modules.analytics.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GenreStatsResponse {
    String genre;
    long views;
}
