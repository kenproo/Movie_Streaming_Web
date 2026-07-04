package com.truong2k4.movie_service.modules.library.repository;

import com.truong2k4.movie_service.modules.library.entity.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, UUID> {
    List<WatchHistory> findAllByUserIdOrderByWatchedAtDesc(UUID userId);
    Optional<WatchHistory> findByUserIdAndMovieIdAndEpisodeNumber(UUID userId, UUID movieId, int episodeNumber);
    Optional<WatchHistory> findFirstByUserIdAndMovieIdOrderByWatchedAtDesc(UUID userId, UUID movieId);
}
