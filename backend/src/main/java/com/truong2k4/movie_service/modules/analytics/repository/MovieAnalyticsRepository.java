package com.truong2k4.movie_service.modules.analytics.repository;

import com.truong2k4.movie_service.modules.analytics.entity.MovieAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovieAnalyticsRepository extends JpaRepository<MovieAnalytics, UUID> {
    Optional<MovieAnalytics> findByMovieId(UUID movieId);
}
