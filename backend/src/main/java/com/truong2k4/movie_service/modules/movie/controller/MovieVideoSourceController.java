package com.truong2k4.movie_service.modules.movie.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieVideoSourceResponse;
import com.truong2k4.movie_service.modules.movie.entity.MovieVideoSource;
import com.truong2k4.movie_service.modules.movie.service.MovieVideoSourceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieVideoSourceController {

    MovieVideoSourceService movieVideoSourceService;

    @GetMapping({"/movies/{movieId}/videos/best", "/api/movies/{movieId}/videos/best"})
    public ApiResponse<MovieVideoSourceResponse> getBestVideo(@PathVariable UUID movieId) {
        MovieVideoSource source = movieVideoSourceService.getBestVideoForMovie(movieId);
        return ApiResponse.<MovieVideoSourceResponse>builder()
                .result(toResponse(source))
                .build();
    }

    @GetMapping({"/movies/{movieId}/videos", "/api/movies/{movieId}/videos"})
    public ApiResponse<List<MovieVideoSourceResponse>> getVideoSources(@PathVariable UUID movieId) {
        List<MovieVideoSource> sources = movieVideoSourceService.getVideoSources(movieId);
        List<MovieVideoSourceResponse> result = sources.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<MovieVideoSourceResponse>>builder()
                .result(result)
                .build();
    }

    @PostMapping({"/admin/movies/{movieId}/videos/pexels-demo", "/api/admin/movies/{movieId}/videos/pexels-demo"})
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MovieVideoSourceResponse> generatePexelsDemo(@PathVariable UUID movieId) {
        MovieVideoSource source = movieVideoSourceService.generatePexelsDemoVideo(movieId);
        return ApiResponse.<MovieVideoSourceResponse>builder()
                .result(toResponse(source))
                .build();
    }

    private MovieVideoSourceResponse toResponse(MovieVideoSource source) {
        if (source == null) return null;
        return MovieVideoSourceResponse.builder()
                .id(source.getId())
                .movieId(source.getMovie() != null ? source.getMovie().getId() : null)
                .type(source.getType())
                .provider(source.getProvider())
                .videoUrl(source.getVideoUrl())
                .embedUrl(source.getEmbedUrl())
                .quality(source.getQuality())
                .durationSeconds(source.getDurationSeconds())
                .licenseType(source.getLicenseType())
                .attribution(source.getAttribution())
                .isDemo(source.getIsDemo())
                .isActive(source.getIsActive())
                .build();
    }
}
