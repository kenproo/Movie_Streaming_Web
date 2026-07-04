package com.truong2k4.movie_service.modules.movie.dto.response;

import com.truong2k4.movie_service.modules.movie.entity.MovieType;
import com.truong2k4.movie_service.modules.movie.entity.ReleaseStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieSummaryResponse {
    UUID id;
    String title;
    String originalTitle;
    String slug;
    String posterUrl;
    String backdropUrl;
    int year;
    String country;
    MovieType type;
    List<String> genres;
    double rating;
    long views;
    ReleaseStatus releaseStatus;
    String quality;
    String duration;
    int totalEpisodes;
    int currentEpisode;
}
