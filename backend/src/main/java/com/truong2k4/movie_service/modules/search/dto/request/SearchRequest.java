package com.truong2k4.movie_service.modules.search.dto.request;

import com.truong2k4.movie_service.modules.movie.entity.MovieType;
import com.truong2k4.movie_service.modules.movie.entity.ReleaseStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchRequest {
    String keyword;
    String genre;
    String country;
    Integer year;
    MovieType type;
    ReleaseStatus releaseStatus;
    String sortBy; // latest, rating, view
    @Builder.Default
    int page = 0;
    @Builder.Default
    int size = 20;
}
