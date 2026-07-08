package com.truong2k4.movie_service.modules.movie.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.common.dto.PageResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse;
import com.truong2k4.movie_service.modules.movie.entity.MovieType;
import com.truong2k4.movie_service.modules.movie.entity.ReleaseStatus;
import com.truong2k4.movie_service.modules.movie.mapper.MovieMapper;
import com.truong2k4.movie_service.modules.movie.service.MovieService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ApiResponse<PageResponse<MovieSummaryResponse>> getMovies(
            @RequestParam(required = false) MovieType type,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) ReleaseStatus releaseStatus,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        if (page < 0) {
            page = 0;
        }
        if (size > 100) {
            size = 100;
        }
        if (size <= 0) {
            size = 20;
        }

        Sort sort;
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            sort = getSortOrder(sortBy);
        } else {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        var moviePage = movieService.getPublishedMovies(type, genre, country, year, releaseStatus, keyword, pageable);
        
        var content = moviePage.getContent().stream()
                .map(movieMapper::toSummaryResponse)
                .collect(Collectors.toList());

        var pageResponse = PageResponse.<MovieSummaryResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .last(moviePage.isLast())
                .build();

        return ApiResponse.<PageResponse<MovieSummaryResponse>>builder()
                .result(pageResponse)
                .build();
    }

    private Sort getSortOrder(String sortBy) {
        if (sortBy == null) {
            return Sort.unsorted();
        }
        return switch (sortBy) {
            case "latest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "newest-year" -> Sort.by(Sort.Direction.DESC, "year");
            case "oldest-year" -> Sort.by(Sort.Direction.ASC, "year");
            case "rating-desc" -> Sort.by(Sort.Direction.DESC, "rating");
            case "views-desc" -> Sort.by(Sort.Direction.DESC, "views");
            case "title-asc" -> Sort.by(Sort.Direction.ASC, "title");
            default -> Sort.unsorted();
        };
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
