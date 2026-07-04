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
public class MovieResponse {
    UUID id;
    String title;
    String originalTitle;
    String slug;
    String description;
    int year;
    String country;
    MovieType type;
    String quality;
    String language;
    double rating;
    String duration;
    int totalEpisodes;
    int currentEpisode;
    ReleaseStatus releaseStatus;
    MovieStatus status;
    long views;
    String posterUrl;
    String backdropUrl;
    String trailerUrl;
    AnimeSeason animeSeason;
    String director;
    String writer;
    String studio;
    String ageRating;
    String tmdbId;
    String imdbId;
    Double popularity;
    List<String> genres;
    List<String> cast;
    List<String> keywords;
    List<String> tags;
    List<EpisodeResponse> episodes;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
