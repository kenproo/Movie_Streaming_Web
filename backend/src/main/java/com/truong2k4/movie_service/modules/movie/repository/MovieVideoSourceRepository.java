package com.truong2k4.movie_service.modules.movie.repository;

import com.truong2k4.movie_service.modules.movie.entity.MovieVideoSource;
import com.truong2k4.movie_service.modules.movie.entity.VideoProvider;
import com.truong2k4.movie_service.modules.movie.entity.VideoType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovieVideoSourceRepository extends JpaRepository<MovieVideoSource, Long> {

    Optional<MovieVideoSource> findFirstByMovieIdAndTypeAndProviderAndIsActiveTrue(
            UUID movieId,
            VideoType type,
            VideoProvider provider
    );

    List<MovieVideoSource> findByMovieIdAndIsActiveTrue(UUID movieId);

    Optional<MovieVideoSource> findFirstByMovieIdAndIsDemoTrueAndIsActiveTrue(UUID movieId);
}
