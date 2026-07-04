package com.truong2k4.movie_service.modules.movie.mapper;

import com.truong2k4.movie_service.modules.movie.dto.request.MovieCreateRequest;
import com.truong2k4.movie_service.modules.movie.dto.request.MovieUpdateRequest;
import com.truong2k4.movie_service.modules.movie.dto.response.EpisodeResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieDetailResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieResponse;
import com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse;
import com.truong2k4.movie_service.modules.movie.entity.Episode;
import com.truong2k4.movie_service.modules.movie.entity.Movie;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MovieMapper {

    public MovieSummaryResponse toSummaryResponse(Movie movie) {
        if (movie == null) return null;
        return MovieSummaryResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .originalTitle(movie.getOriginalTitle())
                .slug(movie.getSlug())
                .posterUrl(movie.getPosterUrl())
                .backdropUrl(movie.getBackdropUrl())
                .year(movie.getYear())
                .country(movie.getCountry())
                .type(movie.getType())
                .genres(movie.getGenres())
                .rating(movie.getRating())
                .views(movie.getViews())
                .releaseStatus(movie.getReleaseStatus())
                .quality(movie.getQuality())
                .duration(movie.getDuration())
                .totalEpisodes(movie.getTotalEpisodes())
                .currentEpisode(movie.getCurrentEpisode())
                .build();
    }

    public MovieResponse toResponse(Movie movie) {
        if (movie == null) return null;
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .originalTitle(movie.getOriginalTitle())
                .slug(movie.getSlug())
                .description(movie.getDescription())
                .year(movie.getYear())
                .country(movie.getCountry())
                .type(movie.getType())
                .quality(movie.getQuality())
                .language(movie.getLanguage())
                .rating(movie.getRating())
                .duration(movie.getDuration())
                .totalEpisodes(movie.getTotalEpisodes())
                .currentEpisode(movie.getCurrentEpisode())
                .releaseStatus(movie.getReleaseStatus())
                .status(movie.getStatus())
                .views(movie.getViews())
                .posterUrl(movie.getPosterUrl())
                .backdropUrl(movie.getBackdropUrl())
                .trailerUrl(movie.getTrailerUrl())
                .animeSeason(movie.getAnimeSeason())
                .director(movie.getDirector())
                .writer(movie.getWriter())
                .studio(movie.getStudio())
                .ageRating(movie.getAgeRating())
                .tmdbId(movie.getTmdbId())
                .imdbId(movie.getImdbId())
                .popularity(movie.getPopularity())
                .genres(movie.getGenres())
                .cast(movie.getCast())
                .keywords(movie.getKeywords())
                .tags(movie.getTags())
                .episodes(toEpisodeResponseList(movie.getEpisodes()))
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }

    public MovieDetailResponse toDetailResponse(Movie movie) {
        if (movie == null) return null;
        return MovieDetailResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .originalTitle(movie.getOriginalTitle())
                .slug(movie.getSlug())
                .description(movie.getDescription())
                .year(movie.getYear())
                .country(movie.getCountry())
                .type(movie.getType())
                .quality(movie.getQuality())
                .language(movie.getLanguage())
                .rating(movie.getRating())
                .duration(movie.getDuration())
                .totalEpisodes(movie.getTotalEpisodes())
                .currentEpisode(movie.getCurrentEpisode())
                .releaseStatus(movie.getReleaseStatus())
                .status(movie.getStatus())
                .views(movie.getViews())
                .posterUrl(movie.getPosterUrl())
                .backdropUrl(movie.getBackdropUrl())
                .trailerUrl(movie.getTrailerUrl())
                .animeSeason(movie.getAnimeSeason())
                .director(movie.getDirector())
                .writer(movie.getWriter())
                .studio(movie.getStudio())
                .ageRating(movie.getAgeRating())
                .tmdbId(movie.getTmdbId())
                .imdbId(movie.getImdbId())
                .popularity(movie.getPopularity())
                .genres(movie.getGenres())
                .cast(movie.getCast())
                .keywords(movie.getKeywords())
                .tags(movie.getTags())
                .episodes(toEpisodeResponseList(movie.getEpisodes()))
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }

    public Movie toEntity(MovieCreateRequest request) {
        if (request == null) return null;
        return Movie.builder()
                .title(request.getTitle())
                .originalTitle(request.getOriginalTitle())
                .slug(request.getSlug())
                .description(request.getDescription())
                .year(request.getYear())
                .country(request.getCountry())
                .type(request.getType())
                .quality(request.getQuality())
                .language(request.getLanguage())
                .duration(request.getDuration())
                .totalEpisodes(request.getTotalEpisodes())
                .currentEpisode(request.getCurrentEpisode())
                .releaseStatus(request.getReleaseStatus())
                .status(request.getStatus())
                .posterUrl(request.getPosterUrl())
                .backdropUrl(request.getBackdropUrl())
                .trailerUrl(request.getTrailerUrl())
                .animeSeason(request.getAnimeSeason())
                .director(request.getDirector())
                .writer(request.getWriter())
                .studio(request.getStudio())
                .ageRating(request.getAgeRating())
                .tmdbId(request.getTmdbId())
                .imdbId(request.getImdbId())
                .popularity(request.getPopularity())
                .genres(request.getGenres() != null ? request.getGenres() : Collections.emptyList())
                .cast(request.getCast() != null ? request.getCast() : Collections.emptyList())
                .keywords(request.getKeywords() != null ? request.getKeywords() : Collections.emptyList())
                .tags(request.getTags() != null ? request.getTags() : Collections.emptyList())
                .build();
    }

    public void updateEntity(Movie movie, MovieUpdateRequest request) {
        if (request.getTitle() != null) movie.setTitle(request.getTitle());
        if (request.getOriginalTitle() != null) movie.setOriginalTitle(request.getOriginalTitle());
        if (request.getSlug() != null) movie.setSlug(request.getSlug());
        if (request.getDescription() != null) movie.setDescription(request.getDescription());
        if (request.getYear() != null) movie.setYear(request.getYear());
        if (request.getCountry() != null) movie.setCountry(request.getCountry());
        if (request.getType() != null) movie.setType(request.getType());
        if (request.getQuality() != null) movie.setQuality(request.getQuality());
        if (request.getLanguage() != null) movie.setLanguage(request.getLanguage());
        if (request.getDuration() != null) movie.setDuration(request.getDuration());
        if (request.getTotalEpisodes() != null) movie.setTotalEpisodes(request.getTotalEpisodes());
        if (request.getCurrentEpisode() != null) movie.setCurrentEpisode(request.getCurrentEpisode());
        if (request.getReleaseStatus() != null) movie.setReleaseStatus(request.getReleaseStatus());
        if (request.getStatus() != null) movie.setStatus(request.getStatus());
        if (request.getPosterUrl() != null) movie.setPosterUrl(request.getPosterUrl());
        if (request.getBackdropUrl() != null) movie.setBackdropUrl(request.getBackdropUrl());
        if (request.getTrailerUrl() != null) movie.setTrailerUrl(request.getTrailerUrl());
        if (request.getAnimeSeason() != null) movie.setAnimeSeason(request.getAnimeSeason());
        if (request.getDirector() != null) movie.setDirector(request.getDirector());
        if (request.getWriter() != null) movie.setWriter(request.getWriter());
        if (request.getStudio() != null) movie.setStudio(request.getStudio());
        if (request.getAgeRating() != null) movie.setAgeRating(request.getAgeRating());
        if (request.getTmdbId() != null) movie.setTmdbId(request.getTmdbId());
        if (request.getImdbId() != null) movie.setImdbId(request.getImdbId());
        if (request.getPopularity() != null) movie.setPopularity(request.getPopularity());
        if (request.getGenres() != null) movie.setGenres(request.getGenres());
        if (request.getCast() != null) movie.setCast(request.getCast());
        if (request.getKeywords() != null) movie.setKeywords(request.getKeywords());
        if (request.getTags() != null) movie.setTags(request.getTags());
    }

    private EpisodeResponse toEpisodeResponse(Episode episode) {
        if (episode == null) return null;
        return EpisodeResponse.builder()
                .id(episode.getId())
                .episodeNumber(episode.getEpisodeNumber())
                .title(episode.getTitle())
                .videoUrl(episode.getVideoUrl())
                .summary(episode.getSummary())
                .duration(episode.getDuration())
                .thumbnailUrl(episode.getThumbnailUrl())
                .releasedAt(episode.getReleasedAt())
                .build();
    }

    private List<EpisodeResponse> toEpisodeResponseList(List<Episode> episodes) {
        if (episodes == null) return Collections.emptyList();
        return episodes.stream().map(this::toEpisodeResponse).collect(Collectors.toList());
    }
}
