package com.truong2k4.movie_service.modules.movie.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.movie.entity.*;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieService {

    MovieRepository movieRepository;

    public List<Movie> getPublishedMovies(MovieType type, String genre, String country, Integer year, ReleaseStatus releaseStatus, String keyword) {
        return movieRepository.findFilteredMovies(
                MovieStatus.PUBLISHED,
                type,
                genre,
                country,
                year,
                releaseStatus,
                keyword
        );
    }

    public Movie getMovieBySlug(String slug) {
        return movieRepository.findBySlugAndStatus(slug, MovieStatus.PUBLISHED)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }

    public List<Movie> getRelatedMovies(UUID movieId) {
        Movie currentMovie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        List<String> currentGenres = currentMovie.getGenres();
        if (currentGenres.isEmpty()) {
            return Collections.emptyList();
        }

        return movieRepository.findAllByStatus(MovieStatus.PUBLISHED).stream()
                .filter(movie -> !movie.getId().equals(movieId))
                .filter(movie -> movie.getGenres().stream().anyMatch(currentGenres::contains))
                .limit(8)
                .collect(Collectors.toList());
    }

    public List<Movie> getAllMoviesAdmin() {
        return movieRepository.findAll();
    }

    public Movie getMovieByIdAdmin(UUID id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }

    @Transactional
    public Movie createMovie(Movie movieData) {
        if (movieRepository.findBySlug(movieData.getSlug()).isPresent()) {
            throw new AppException(ErrorCode.INVALID_INPUT); // Slug must be unique
        }

        movieData.setCreatedAt(LocalDateTime.now());
        movieData.setUpdatedAt(LocalDateTime.now());
        movieData.setViews(0);

        if (movieData.getEpisodes() != null) {
            movieData.getEpisodes().forEach(episode -> episode.setMovie(movieData));
        }

        return movieRepository.save(movieData);
    }

    @Transactional
    public Movie updateMovie(UUID id, Movie movieData) {
        Movie existing = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        existing.setSlug(movieData.getSlug());
        existing.setTitle(movieData.getTitle());
        existing.setOriginalTitle(movieData.getOriginalTitle());
        existing.setDescription(movieData.getDescription());
        existing.setYear(movieData.getYear());
        existing.setCountry(movieData.getCountry());
        existing.setType(movieData.getType());
        existing.setQuality(movieData.getQuality());
        existing.setLanguage(movieData.getLanguage());
        existing.setRating(movieData.getRating());
        existing.setDuration(movieData.getDuration());
        existing.setTotalEpisodes(movieData.getTotalEpisodes());
        existing.setCurrentEpisode(movieData.getCurrentEpisode());
        existing.setReleaseStatus(movieData.getReleaseStatus());
        existing.setStatus(movieData.getStatus());
        existing.setPosterUrl(movieData.getPosterUrl());
        existing.setBackdropUrl(movieData.getBackdropUrl());
        existing.setTrailerUrl(movieData.getTrailerUrl());
        existing.setAnimeSeason(movieData.getAnimeSeason());
        existing.setUpdatedAt(LocalDateTime.now());

        if (movieData.getGenres() != null) {
            existing.setGenres(movieData.getGenres());
        }
        if (movieData.getCast() != null) {
            existing.setCast(movieData.getCast());
        }

        // Handle updating child episodes list
        existing.getEpisodes().clear();
        if (movieData.getEpisodes() != null) {
            movieData.getEpisodes().forEach(episode -> {
                episode.setMovie(existing);
                existing.getEpisodes().add(episode);
            });
        }

        return movieRepository.save(existing);
    }

    public void deleteMovie(UUID id) {
        if (!movieRepository.existsById(id)) {
            throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
        }
        movieRepository.deleteById(id);
    }

    public Movie toggleMovieStatus(UUID id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (movie.getStatus() == MovieStatus.HIDDEN || movie.getStatus() == MovieStatus.DRAFT) {
            movie.setStatus(MovieStatus.PUBLISHED);
        } else {
            movie.setStatus(MovieStatus.HIDDEN);
        }
        movie.setUpdatedAt(LocalDateTime.now());
        return movieRepository.save(movie);
    }
}
