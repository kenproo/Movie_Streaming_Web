package com.truong2k4.movie_service.modules.analytics.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.analytics.dto.DashboardStatsResponse;
import com.truong2k4.movie_service.modules.analytics.dto.GenreStatsResponse;
import com.truong2k4.movie_service.modules.analytics.entity.AccessLog;
import com.truong2k4.movie_service.modules.analytics.entity.DailyTraffic;
import com.truong2k4.movie_service.modules.analytics.entity.MovieAnalytics;
import com.truong2k4.movie_service.modules.analytics.repository.AccessLogRepository;
import com.truong2k4.movie_service.modules.analytics.repository.DailyTrafficRepository;
import com.truong2k4.movie_service.modules.analytics.repository.MovieAnalyticsRepository;
import com.truong2k4.movie_service.modules.comment.repository.CommentRepository;
import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.movie.entity.MovieStatus;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AnalyticsService {

    AccessLogRepository accessLogRepository;
    DailyTrafficRepository dailyTrafficRepository;
    MovieAnalyticsRepository movieAnalyticsRepository;
    MovieRepository movieRepository;
    UserRepository userRepository;
    CommentRepository commentRepository;

    public DashboardStatsResponse getDashboardStats() {
        long totalMovies = movieRepository.count();
        long totalUsers = userRepository.count();
        long totalComments = commentRepository.count();

        List<MovieAnalytics> movieAnalytics = movieAnalyticsRepository.findAll();
        long totalViews = movieAnalytics.stream().mapToLong(MovieAnalytics::getViews).sum();
        long totalWatchTime = movieAnalytics.stream().mapToLong(MovieAnalytics::getWatchTimeMinutes).sum();

        List<DailyTraffic> traffic = dailyTrafficRepository.findAll();
        long totalVisits = traffic.stream().mapToLong(DailyTraffic::getVisits).sum();

        LocalDate today = LocalDate.now();
        long todayViews = dailyTrafficRepository.findByDate(today)
                .map(DailyTraffic::getViews)
                .orElse(0);

        long hotMovies = movieRepository.findAllByStatus(MovieStatus.PUBLISHED).stream()
                .filter(m -> m.getViews() > 0)
                .count();

        return DashboardStatsResponse.builder()
                .totalViews(totalViews)
                .totalVisits(totalVisits)
                .totalWatchTimeMinutes(totalWatchTime)
                .totalComments(totalComments)
                .totalMovies(totalMovies)
                .totalUsers(totalUsers)
                .hotMovies(hotMovies)
                .todayViews(todayViews)
                .build();
    }

    public List<Movie> getTopMovies() {
        // Sort movies by views descending, limit to 10
        return movieRepository.findAllByStatus(MovieStatus.PUBLISHED).stream()
                .sorted((a, b) -> Long.compare(b.getViews(), a.getViews()))
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<DailyTraffic> getDailyTraffic() {
        return dailyTrafficRepository.findAllByOrderByDateAsc();
    }

    public List<GenreStatsResponse> getGenreStats() {
        Map<String, Long> genreViewsMap = new HashMap<>();

        movieRepository.findAllByStatus(MovieStatus.PUBLISHED).forEach(movie -> {
            long views = movie.getViews();
            if (movie.getGenres() != null) {
                movie.getGenres().forEach(genre -> {
                    genreViewsMap.put(genre, genreViewsMap.getOrDefault(genre, 0L) + views);
                });
            }
        });

        return genreViewsMap.entrySet().stream()
                .map(entry -> GenreStatsResponse.builder()
                        .genre(entry.getKey())
                        .views(entry.getValue())
                        .build())
                .sorted((a, b) -> Long.compare(b.getViews(), a.getViews()))
                .collect(Collectors.toList());
    }

    public List<AccessLog> getAccessLogs() {
        return accessLogRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public void trackView(UUID movieId) {
        // Increment views in Movie entity
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        movie.setViews(movie.getViews() + 1);
        movieRepository.save(movie);

        // Update MovieAnalytics
        MovieAnalytics analytics = movieAnalyticsRepository.findByMovieId(movieId)
                .orElseGet(() -> MovieAnalytics.builder().movieId(movieId).build());
        analytics.setViews(analytics.getViews() + 1);
        movieAnalyticsRepository.save(analytics);

        // Update DailyTraffic
        LocalDate today = LocalDate.now();
        DailyTraffic daily = dailyTrafficRepository.findByDate(today)
                .orElseGet(() -> DailyTraffic.builder().date(today).build());
        daily.setViews(daily.getViews() + 1);
        dailyTrafficRepository.save(daily);

        // Append log
        appendLog(movieId, "/watch/" + movieId, "watch", null);
    }

    @Transactional
    public void trackVisit(String page) {
        LocalDate today = LocalDate.now();
        DailyTraffic daily = dailyTrafficRepository.findByDate(today)
                .orElseGet(() -> DailyTraffic.builder().date(today).build());
        daily.setVisits(daily.getVisits() + 1);
        dailyTrafficRepository.save(daily);

        appendLog(null, page, "visit", null);
    }

    @Transactional
    public void trackSearch(String keyword) {
        appendLog(null, "/search", "search", keyword);
    }

    @Transactional
    public void trackComment(UUID movieId) {
        MovieAnalytics analytics = movieAnalyticsRepository.findByMovieId(movieId)
                .orElseGet(() -> MovieAnalytics.builder().movieId(movieId).build());
        analytics.setComments(analytics.getComments() + 1);
        movieAnalyticsRepository.save(analytics);

        appendLog(movieId, "/movie/" + movieId, "comment", null);
    }

    private void appendLog(UUID movieId, String page, String action, String keyword) {
        UUID userId = null;
        try {
            var context = SecurityContextHolder.getContext();
            if (context != null && context.getAuthentication() != null && context.getAuthentication().isAuthenticated()) {
                String name = context.getAuthentication().getName();
                Optional<User> userOpt = userRepository.findByUsername(name).or(() -> userRepository.findByEmail(name));
                if (userOpt.isPresent()) {
                    userId = userOpt.get().getId();
                }
            }
        } catch (Exception e) {
            // Ignored, context might be empty
        }

        AccessLog logItem = AccessLog.builder()
                .userId(userId)
                .movieId(movieId)
                .page(page)
                .action(action)
                .keyword(keyword)
                .createdAt(LocalDateTime.now())
                .build();
        accessLogRepository.save(logItem);
    }
}
