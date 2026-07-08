package com.truong2k4.movie_service.modules.movie.dto.request;

import com.truong2k4.movie_service.modules.movie.entity.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieCreateRequest {
    @NotBlank(message = "Title is required")
    String title;

    String originalTitle;

    @NotBlank(message = "Slug is required")
    String slug;

    String description;

    @Min(1900) @Max(2100)
    int year;

    String country;

    MovieType type;

    String quality;
    String language;
    String duration;

    int totalEpisodes;
    int currentEpisode;

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
