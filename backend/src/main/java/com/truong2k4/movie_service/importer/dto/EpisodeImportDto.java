package com.truong2k4.movie_service.importer.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class EpisodeImportDto {
    @JsonAlias({"id", "episodeId", "episode_id"})
    private UUID id;

    @JsonAlias({"movieId", "movie_id"})
    private UUID movieId;

    @JsonAlias({"movieSlug", "movie_slug"})
    private String movieSlug;

    @JsonAlias({"movieTmdbId", "movie_tmdb_id"})
    private String movieTmdbId;

    @JsonAlias({"movieImdbId", "movie_imdb_id"})
    private String movieImdbId;

    @JsonAlias({"episodeNumber", "episode_number"})
    private Integer episodeNumber;

    @JsonAlias({"seasonNumber", "season_number"})
    private Integer seasonNumber;

    @JsonAlias({"title"})
    private String title;

    @JsonAlias({"summary", "overview"})
    private String summary;

    @JsonAlias({"duration"})
    private String duration;

    @JsonAlias({"thumbnailUrl", "thumbnail_url"})
    private String thumbnailUrl;

    @JsonAlias({"releasedAt", "released_at", "releaseDate", "release_date"})
    private String releasedAt;

    @JsonAlias({"sources"})
    private List<EpisodeSourceImportDto> sources;

    @JsonAlias({"subtitles"})
    private List<SubtitleImportDto> subtitles;
}
