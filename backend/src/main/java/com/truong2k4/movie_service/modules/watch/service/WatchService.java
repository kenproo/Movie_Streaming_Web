package com.truong2k4.movie_service.modules.watch.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.library.entity.WatchHistory;
import com.truong2k4.movie_service.modules.library.entity.WatchProgress;
import com.truong2k4.movie_service.modules.library.repository.WatchHistoryRepository;
import com.truong2k4.movie_service.modules.library.repository.WatchProgressRepository;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import com.truong2k4.movie_service.modules.watch.dto.request.UpdateWatchProgressRequest;
import com.truong2k4.movie_service.modules.watch.dto.response.WatchHistoryResponse;
import com.truong2k4.movie_service.modules.watch.dto.response.WatchProgressResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WatchService {

    WatchProgressRepository watchProgressRepository;
    WatchHistoryRepository watchHistoryRepository;
    UserRepository userRepository;

    @Transactional
    public WatchProgressResponse updateProgress(UpdateWatchProgressRequest request) {
        User user = getCurrentUser();
        UUID userId = user.getId();

        WatchProgress progress = watchProgressRepository
                .findByUserIdAndMovieIdAndEpisodeId(userId, request.getMovieId(), request.getEpisodeId())
                .orElse(null);

        if (progress != null) {
            progress.setCurrentTimeSeconds(request.getProgressSeconds());
            if (request.getDurationSeconds() != null) {
                progress.setDurationSeconds(request.getDurationSeconds());
            }
        } else {
            progress = WatchProgress.builder()
                    .userId(userId)
                    .movieId(request.getMovieId())
                    .episodeId(request.getEpisodeId())
                    .episodeNumber(request.getEpisodeNumber())
                    .currentTimeSeconds(request.getProgressSeconds())
                    .durationSeconds(request.getDurationSeconds() != null ? request.getDurationSeconds() : 0)
                    .completed(false)
                    .build();
        }
        progress = watchProgressRepository.save(progress);

        // Update watch history
        watchHistoryRepository.findByUserIdAndMovieIdAndEpisodeNumber(
                        userId, request.getMovieId(), request.getEpisodeNumber())
                .ifPresentOrElse(
                        wh -> {
                            wh.setWatchedAt(LocalDateTime.now());
                            watchHistoryRepository.save(wh);
                        },
                        () -> watchHistoryRepository.save(WatchHistory.builder()
                                .userId(userId)
                                .movieId(request.getMovieId())
                                .episodeNumber(request.getEpisodeNumber())
                                .watchedAt(LocalDateTime.now())
                                .build())
                );

        int dur = progress.getDurationSeconds() != null ? progress.getDurationSeconds() : 0;
        int cur = progress.getCurrentTimeSeconds() != null ? progress.getCurrentTimeSeconds() : 0;
        double percent = dur > 0 ? (double) cur / dur * 100 : 0;

        return WatchProgressResponse.builder()
                .id(progress.getId())
                .movieId(progress.getMovieId())
                .episodeId(progress.getEpisodeId())
                .episodeNumber(progress.getEpisodeNumber())
                .progressSeconds(cur)
                .durationSeconds(dur)
                .progressPercent(Math.round(percent * 10.0) / 10.0)
                .updatedAt(progress.getUpdatedAt())
                .build();
    }

    public List<WatchHistoryResponse> getHistory() {
        User user = getCurrentUser();
        return watchHistoryRepository.findAllByUserIdOrderByWatchedAtDesc(user.getId())
                .stream()
                .map(wh -> WatchHistoryResponse.builder()
                        .id(wh.getId())
                        .movieId(wh.getMovieId())
                        .episodeNumber(wh.getEpisodeNumber())
                        .watchedAt(wh.getWatchedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public WatchProgressResponse getProgress(UUID episodeId) {
        User user = getCurrentUser();
        // Search progress by user + episode across all movies
        List<WatchProgress> progressList = watchProgressRepository
                .findByUserIdOrderByUpdatedAtDesc(user.getId());

        WatchProgress progress = progressList.stream()
                .filter(p -> episodeId.equals(p.getEpisodeId()))
                .findFirst()
                .orElse(null);

        if (progress == null) return null;

        int dur = progress.getDurationSeconds() != null ? progress.getDurationSeconds() : 0;
        int cur = progress.getCurrentTimeSeconds() != null ? progress.getCurrentTimeSeconds() : 0;
        double percent = dur > 0 ? (double) cur / dur * 100 : 0;

        return WatchProgressResponse.builder()
                .id(progress.getId())
                .movieId(progress.getMovieId())
                .episodeId(progress.getEpisodeId())
                .episodeNumber(progress.getEpisodeNumber())
                .progressSeconds(cur)
                .durationSeconds(dur)
                .progressPercent(Math.round(percent * 10.0) / 10.0)
                .updatedAt(progress.getUpdatedAt())
                .build();
    }

    private User getCurrentUser() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(name)
                .or(() -> userRepository.findByEmail(name))
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }
}
