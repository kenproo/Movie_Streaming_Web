package com.truong2k4.movie_service.modules.rating.repository;

import com.truong2k4.movie_service.modules.rating.entity.MovieRating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MovieRatingRepository extends JpaRepository<MovieRating, UUID> {

    Optional<MovieRating> findByUserIdAndMovieId(UUID userId, UUID movieId);

    List<MovieRating> findByMovieIdOrderByCreatedAtDesc(UUID movieId);

    List<MovieRating> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
