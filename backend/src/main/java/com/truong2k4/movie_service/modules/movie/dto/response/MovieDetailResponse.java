package com.truong2k4.movie_service.modules.movie.dto.response;

import com.truong2k4.movie_service.modules.movie.entity.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieDetailResponse {
    UUID id;
    String title;
    String originalTitle;
    String slug;
    String description;
    Integer year;
    String country;
    MovieType type;
    String displayQuality;
    String displayLanguage;
    Double rating;
    String duration;
    Integer totalEpisodes;
    Integer currentEpisode;
    ReleaseStatus releaseStatus;
    MovieStatus status;
    Long views;
    String posterUrl;
    String backdropUrl;
    @Deprecated
    String trailerUrl;
    AnimeSeason animeSeason;
    String director;
    String writer;
    String studio;
    String ageRating;
    String tmdbId;
    String imdbId;
    String tvmazeId;
    String malId;
    String sourceProvider;
    LocalDateTime lastSyncedAt;
    Double popularity;
    List<String> genres;
    List<String> cast;
    List<String> keywords;
    List<String> tags;

    List<EpisodeResponse> episodes;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    // Extra detail fields
    double averageRating;
    long totalRatings;
    long totalComments;
}
