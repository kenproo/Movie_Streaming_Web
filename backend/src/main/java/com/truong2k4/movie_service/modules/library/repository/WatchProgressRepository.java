package com.truong2k4.movie_service.modules.library.repository;

import com.truong2k4.movie_service.modules.library.entity.WatchProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WatchProgressRepository extends JpaRepository<WatchProgress, UUID> {

    Optional<WatchProgress> findByUserIdAndMovieIdAndEpisodeId(UUID userId, UUID movieId, UUID episodeId);

    List<WatchProgress> findByUserIdOrderByUpdatedAtDesc(UUID userId);

    List<WatchProgress> findByUserIdAndMovieIdOrderByEpisodeNumberAsc(UUID userId, UUID movieId);
}
