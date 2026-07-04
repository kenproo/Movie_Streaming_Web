package com.truong2k4.movie_service.modules.analytics.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.analytics.dto.DashboardStatsResponse;
import com.truong2k4.movie_service.modules.analytics.dto.GenreStatsResponse;
import com.truong2k4.movie_service.modules.analytics.dto.response.AccessLogResponse;
import com.truong2k4.movie_service.modules.analytics.dto.response.DailyTrafficResponse;
import com.truong2k4.movie_service.modules.analytics.mapper.AnalyticsMapper;
import com.truong2k4.movie_service.modules.analytics.service.AnalyticsService;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse;
import com.truong2k4.movie_service.modules.movie.mapper.MovieMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AnalyticsController {

    AnalyticsService analyticsService;
    MovieMapper movieMapper;
    AnalyticsMapper analyticsMapper;

    @GetMapping("/admin/analytics/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DashboardStatsResponse> getDashboardStats() {
        return ApiResponse.<DashboardStatsResponse>builder()
                .result(analyticsService.getDashboardStats())
                .build();
    }

    @GetMapping("/admin/analytics/top-movies")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<MovieSummaryResponse>> getTopMovies() {
        var movies = analyticsService.getTopMovies();
        var result = movies.stream()
                .map(movieMapper::toSummaryResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<MovieSummaryResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/admin/analytics/traffic")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<DailyTrafficResponse>> getDailyTraffic() {
        var traffic = analyticsService.getDailyTraffic();
        var result = traffic.stream()
                .map(analyticsMapper::toDailyTrafficResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<DailyTrafficResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/admin/analytics/genres")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<GenreStatsResponse>> getGenreStats() {
        return ApiResponse.<List<GenreStatsResponse>>builder()
                .result(analyticsService.getGenreStats())
                .build();
    }

    @GetMapping("/admin/analytics/access-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<AccessLogResponse>> getAccessLogs() {
        var logs = analyticsService.getAccessLogs();
        var result = logs.stream()
                .map(analyticsMapper::toAccessLogResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<AccessLogResponse>>builder()
                .result(result)
                .build();
    }

    @PostMapping("/analytics/track-view/{movieId}")
    public ApiResponse<String> trackView(@PathVariable UUID movieId) {
        analyticsService.trackView(movieId);
        return ApiResponse.<String>builder()
                .result("Tracked view successfully")
                .build();
    }

    @PostMapping("/analytics/track-visit")
    public ApiResponse<String> trackVisit(@RequestBody Map<String, String> body) {
        String page = body.get("page");
        analyticsService.trackVisit(page);
        return ApiResponse.<String>builder()
                .result("Tracked visit successfully")
                .build();
    }

    @PostMapping("/analytics/track-search")
    public ApiResponse<String> trackSearch(@RequestBody Map<String, String> body) {
        String keyword = body.get("keyword");
        analyticsService.trackSearch(keyword);
        return ApiResponse.<String>builder()
                .result("Tracked search successfully")
                .build();
    }
}
