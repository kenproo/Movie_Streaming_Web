package com.truong2k4.movie_service.modules.movie.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse;
import com.truong2k4.movie_service.modules.movie.entity.MovieType;
import com.truong2k4.movie_service.modules.movie.entity.ReleaseStatus;
import com.truong2k4.movie_service.modules.movie.mapper.MovieMapper;
import com.truong2k4.movie_service.modules.movie.service.MovieService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieController {

    MovieService movieService;
    MovieMapper movieMapper;

    @GetMapping
    public ApiResponse<List<MovieSummaryResponse>> getMovies(
            @RequestParam(required = false) MovieType type,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) ReleaseStatus releaseStatus,
            @RequestParam(required = false) String keyword
    ) {
        var movies = movieService.getPublishedMovies(type, genre, country, year, releaseStatus, keyword);
        var result = movies.stream()
                .map(movieMapper::toSummaryResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<MovieSummaryResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<MovieResponse> getMovieBySlug(@PathVariable String slug) {
        var movie = movieService.getMovieBySlug(slug);
        return ApiResponse.<MovieResponse>builder()
                .result(movieMapper.toResponse(movie))
                .build();
    }

    @GetMapping("/related/{id}")
    public ApiResponse<List<MovieSummaryResponse>> getRelatedMovies(@PathVariable UUID id) {
        var movies = movieService.getRelatedMovies(id);
        var result = movies.stream()
                .map(movieMapper::toSummaryResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<MovieSummaryResponse>>builder()
                .result(result)
                .build();
    }
}
