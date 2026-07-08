package com.truong2k4.movie_service.modules.movie.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.movie.entity.*;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    com.truong2k4.movie_service.modules.library.repository.FollowRepository followRepository;
    com.truong2k4.movie_service.modules.notification.repository.NotificationRepository notificationRepository;

    public Page<Movie> getPublishedMovies(MovieType type, String genre, String country, Integer year, ReleaseStatus releaseStatus, String keyword, Pageable pageable) {
        return movieRepository.findFilteredMoviesPage(
                MovieStatus.PUBLISHED,
                type,
                genre,
                country,
                year,
                releaseStatus,
                keyword,
                pageable
        );
    }

    public List<Movie> getPublishedMovies(MovieType type, String genre, String country, Integer year, ReleaseStatus releaseStatus, String keyword, Sort sort) {
        return movieRepository.findFilteredMoviesList(
                MovieStatus.PUBLISHED,
                type,
                genre,
                country,
                year,
                releaseStatus,
                keyword,
                sort
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
        movieData.setViews(0L);

        // Auto-create 1 default episode for SINGLE movie
        if (movieData.getType() == MovieType.SINGLE && (movieData.getEpisodes() == null || movieData.getEpisodes().isEmpty())) {
            Episode defaultEpisode = Episode.builder()
                    .movie(movieData)
                    .episodeNumber(1)
                    .seasonNumber(1)
                    .title("Full Movie")
                    .build();
            movieData.setEpisodes(new java.util.ArrayList<>(java.util.List.of(defaultEpisode)));
        }

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
        existing.setDisplayQuality(movieData.getDisplayQuality());
        existing.setDisplayLanguage(movieData.getDisplayLanguage());
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
        existing.setTvmazeId(movieData.getTvmazeId());
        existing.setMalId(movieData.getMalId());
        existing.setSourceProvider(movieData.getSourceProvider());
        existing.setLastSyncedAt(movieData.getLastSyncedAt());
        existing.setUpdatedAt(LocalDateTime.now());

        if (movieData.getGenres() != null) {
            existing.setGenres(movieData.getGenres());
        }
        if (movieData.getCast() != null) {
            existing.setCast(movieData.getCast());
        }

        // Handle updating child episodes list
        List<Integer> existingEpisodeNums = existing.getEpisodes().stream()
                .map(Episode::getEpisodeNumber)
                .collect(Collectors.toList());

        existing.getEpisodes().clear();
        if (movieData.getEpisodes() != null) {
            movieData.getEpisodes().forEach(episode -> {
                episode.setMovie(existing);
                existing.getEpisodes().add(episode);
            });
        }

        Movie saved = movieRepository.save(existing);

        // Notify followers of any new episode
        if (movieData.getEpisodes() != null) {
            List<Episode> newEpisodes = saved.getEpisodes().stream()
                    .filter(ep -> !existingEpisodeNums.contains(ep.getEpisodeNumber()))
                    .collect(Collectors.toList());

            if (!newEpisodes.isEmpty()) {
                notifyFollowersNewEpisode(saved, newEpisodes);
            }
        }

        return saved;
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

    private void notifyFollowersNewEpisode(Movie movie, List<Episode> newEpisodes) {
        List<com.truong2k4.movie_service.modules.library.entity.Follow> follows = followRepository.findAllByMovieId(movie.getId());
        if (follows.isEmpty()) return;

        for (Episode episode : newEpisodes) {
            String title = "Tập mới: " + movie.getTitle();
            String content = "Tập " + episode.getEpisodeNumber() + " (" + (episode.getTitle() != null && !episode.getTitle().isBlank() ? episode.getTitle() : "Tập " + episode.getEpisodeNumber()) + ") đã được cập nhật!";
            String targetUrl = "/watch/" + movie.getSlug() + "?episode=" + episode.getEpisodeNumber();

            List<com.truong2k4.movie_service.modules.notification.entity.Notification> notifications = follows.stream().map(follow -> com.truong2k4.movie_service.modules.notification.entity.Notification.builder()
                    .userId(follow.getUserId())
                    .type(com.truong2k4.movie_service.modules.notification.entity.NotificationType.NEW_EPISODE)
                    .title(title)
                    .content(content)
                    .targetUrl(targetUrl)
                    .movieId(movie.getId())
                    .episodeId(episode.getId())
                    .read(false)
                    .build()
            ).collect(Collectors.toList());

            notificationRepository.saveAll(notifications);
        }
    }
}
