package com.truong2k4.movie_service.modules.movie.repository;

import com.truong2k4.movie_service.modules.movie.entity.Subtitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubtitleRepository extends JpaRepository<Subtitle, UUID> {
    Optional<Subtitle> findByEpisodeIdAndLanguageAndFormat(UUID episodeId, String language, String format);
}
