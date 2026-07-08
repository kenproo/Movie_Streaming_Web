package com.truong2k4.movie_service.modules.rating.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieRatingStatsResponse {
    double averageScore;
    long totalRatings;
}
