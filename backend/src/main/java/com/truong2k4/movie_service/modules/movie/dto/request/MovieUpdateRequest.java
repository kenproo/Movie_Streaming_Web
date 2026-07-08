package com.truong2k4.movie_service.modules.movie.dto.request;

import com.truong2k4.movie_service.modules.movie.entity.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieUpdateRequest {
    String title;
    String originalTitle;
    String slug;
    String description;
    Integer year;
    String country;
    MovieType type;
    String quality;
    String language;
    String duration;
    Integer totalEpisodes;
    Integer currentEpisode;
    ReleaseStatus releaseStatus;
    MovieStatus status;
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
}
