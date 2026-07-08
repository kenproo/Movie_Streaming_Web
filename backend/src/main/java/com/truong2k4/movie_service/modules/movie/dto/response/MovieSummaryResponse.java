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
    Integer year;
    String country;
    MovieType type;
    List<String> genres;
    Double rating;
    Long views;
    ReleaseStatus releaseStatus;
    String displayQuality;
    String displayLanguage;
    String duration;
    Integer totalEpisodes;
    Integer currentEpisode;
    String tvmazeId;
    String malId;
    String sourceProvider;

}
