package com.truong2k4.movie_service.modules.movie.repository;

import com.truong2k4.movie_service.modules.movie.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, UUID> {
    List<Episode> findAllByMovieIdOrderByEpisodeNumberAsc(UUID movieId);
    Optional<Episode> findByMovieIdAndEpisodeNumber(UUID movieId, int episodeNumber);
}
