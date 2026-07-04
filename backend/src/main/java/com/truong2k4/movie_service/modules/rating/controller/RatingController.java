package com.truong2k4.movie_service.modules.rating.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.rating.dto.request.RatingRequest;
import com.truong2k4.movie_service.modules.rating.dto.response.MovieRatingStatsResponse;
import com.truong2k4.movie_service.modules.rating.dto.response.RatingResponse;
import com.truong2k4.movie_service.modules.rating.service.RatingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingController {

    RatingService ratingService;

    @PostMapping
    public ApiResponse<RatingResponse> upsertRating(@RequestBody @Valid RatingRequest request) {
        return ApiResponse.<RatingResponse>builder()
                .result(ratingService.upsertRating(request))
                .build();
    }

    @GetMapping("/movie/{movieId}")
    public ApiResponse<List<RatingResponse>> getMovieRatings(@PathVariable UUID movieId) {
        return ApiResponse.<List<RatingResponse>>builder()
                .result(ratingService.getMovieRatings(movieId))
                .build();
    }

    @GetMapping("/movie/{movieId}/stats")
    public ApiResponse<MovieRatingStatsResponse> getMovieStats(@PathVariable UUID movieId) {
        return ApiResponse.<MovieRatingStatsResponse>builder()
                .result(ratingService.getMovieStats(movieId))
                .build();
    }

    @GetMapping("/movie/{movieId}/mine")
    public ApiResponse<RatingResponse> getMyRating(@PathVariable UUID movieId) {
        return ApiResponse.<RatingResponse>builder()
                .result(ratingService.getMyRating(movieId).orElse(null))
                .build();
    }
}
