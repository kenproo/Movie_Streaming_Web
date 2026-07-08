package com.truong2k4.movie_service.modules.movie.repository;

import com.truong2k4.movie_service.modules.movie.entity.EpisodeSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EpisodeSourceRepository extends JpaRepository<EpisodeSource, UUID> {
    Optional<EpisodeSource> findByEpisodeIdAndServerNameAndQuality(UUID episodeId, String serverName, String quality);
}
