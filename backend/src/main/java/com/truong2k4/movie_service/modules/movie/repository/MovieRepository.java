package com.truong2k4.movie_service.modules.movie.repository;

import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.movie.entity.MovieStatus;
import com.truong2k4.movie_service.modules.movie.entity.MovieType;
import com.truong2k4.movie_service.modules.movie.entity.ReleaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> {
    Optional<Movie> findBySlug(String slug);
    Optional<Movie> findBySlugAndStatus(String slug, MovieStatus status);
    List<Movie> findAllByStatus(MovieStatus status);

    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN m.genres g WHERE " +
           "(m.status = :status) AND " +
           "(:type IS NULL OR m.type = :type) AND " +
           "(:genre IS NULL OR LOWER(g) = LOWER(:genre)) AND " +
           "(:country IS NULL OR LOWER(m.country) = LOWER(:country)) AND " +
           "(:year IS NULL OR m.year = :year) AND " +
           "(:releaseStatus IS NULL OR m.releaseStatus = :releaseStatus) AND " +
           "(:keyword IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.originalTitle) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Movie> findFilteredMovies(
            @Param("status") MovieStatus status,
            @Param("type") MovieType type,
            @Param("genre") String genre,
            @Param("country") String country,
            @Param("year") Integer year,
            @Param("releaseStatus") ReleaseStatus releaseStatus,
            @Param("keyword") String keyword
    );
}
