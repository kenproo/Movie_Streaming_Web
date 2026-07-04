package com.truong2k4.movie_service.modules.rating.mapper;

import com.truong2k4.movie_service.modules.rating.dto.response.RatingResponse;
import com.truong2k4.movie_service.modules.rating.entity.MovieRating;
import org.springframework.stereotype.Component;

@Component
public class RatingMapper {

    public RatingResponse toResponse(MovieRating rating) {
        if (rating == null) return null;
        return RatingResponse.builder()
                .id(rating.getId())
                .userId(rating.getUserId())
                .movieId(rating.getMovieId())
                .score(rating.getScore())
                .review(rating.getReview())
                .status(rating.getStatus())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .build();
    }
}
