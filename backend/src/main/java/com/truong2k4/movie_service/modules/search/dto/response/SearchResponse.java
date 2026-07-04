package com.truong2k4.movie_service.modules.search.dto.response;

import com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchResponse {
    List<MovieSummaryResponse> movies;
    long totalResults;
    int page;
    int size;
    int totalPages;
}
