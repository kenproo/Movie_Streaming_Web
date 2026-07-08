package com.truong2k4.movie_service.modules.library.repository;

import com.truong2k4.movie_service.modules.library.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    List<Favorite> findAllByUserId(UUID userId);
    Optional<Favorite> findByUserIdAndMovieId(UUID userId, UUID movieId);
    boolean existsByUserIdAndMovieId(UUID userId, UUID movieId);
}
