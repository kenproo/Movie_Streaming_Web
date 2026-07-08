package com.truong2k4.movie_service.modules.movie.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.movie.dto.request.MovieCreateRequest;
import com.truong2k4.movie_service.modules.movie.dto.request.MovieUpdateRequest;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieResponse;
import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.movie.mapper.MovieMapper;
import com.truong2k4.movie_service.modules.movie.service.MovieService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class AdminMovieController {

    MovieService movieService;
    MovieMapper movieMapper;

    @GetMapping
    public ApiResponse<List<MovieResponse>> getAdminMovies() {
        var movies = movieService.getAllMoviesAdmin();
        var result = movies.stream()
                .map(movieMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<MovieResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<MovieResponse> getMovieById(@PathVariable UUID id) {
        var movie = movieService.getMovieByIdAdmin(id);
        return ApiResponse.<MovieResponse>builder()
                .result(movieMapper.toResponse(movie))
                .build();
    }

    @PostMapping
    public ApiResponse<MovieResponse> createMovie(@RequestBody @Valid MovieCreateRequest request) {
        Movie movieData = movieMapper.toEntity(request);
        Movie created = movieService.createMovie(movieData);
        return ApiResponse.<MovieResponse>builder()
                .result(movieMapper.toResponse(created))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<MovieResponse> updateMovie(@PathVariable UUID id, @RequestBody @Valid MovieUpdateRequest request) {
        Movie existing = movieService.getMovieByIdAdmin(id);
        movieMapper.updateEntity(existing, request);
        Movie updated = movieService.updateMovie(id, existing);
        return ApiResponse.<MovieResponse>builder()
                .result(movieMapper.toResponse(updated))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMovie(@PathVariable UUID id) {
        movieService.deleteMovie(id);
        return ApiResponse.<String>builder()
                .result("Deleted movie successfully")
                .build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<MovieResponse> toggleMovieStatus(@PathVariable UUID id) {
        Movie toggled = movieService.toggleMovieStatus(id);
        return ApiResponse.<MovieResponse>builder()
                .result(movieMapper.toResponse(toggled))
                .build();
    }
}
