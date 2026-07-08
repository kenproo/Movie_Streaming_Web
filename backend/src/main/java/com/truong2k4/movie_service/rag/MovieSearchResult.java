package com.truong2k4.movie_service.rag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieSearchResult {
    private UUID movieId;
    private String slug;
    private Double score;
    private String title;
}
