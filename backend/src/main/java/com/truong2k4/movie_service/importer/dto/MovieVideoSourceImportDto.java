package com.truong2k4.movie_service.importer.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieVideoSourceImportDto {
    @JsonAlias({"id"})
    private Long id;

    @JsonAlias({"movieId", "movie_id"})
    private UUID movieId;

    @JsonAlias({"movieSlug", "movie_slug"})
    private String movieSlug;

    @JsonAlias({"movieTmdbId", "movie_tmdb_id"})
    private String movieTmdbId;

    @JsonAlias({"movieImdbId", "movie_imdb_id"})
    private String movieImdbId;

    @JsonAlias({"type"})
    private String type;

    @JsonAlias({"provider"})
    private String provider;

    @JsonAlias({"videoUrl", "video_url"})
    private String videoUrl;

    @JsonAlias({"embedUrl", "embed_url"})
    private String embedUrl;

    @JsonAlias({"storageKey", "storage_key"})
    private String storageKey;

    @JsonAlias({"quality"})
    private String quality;

    @JsonAlias({"durationSeconds", "duration_seconds"})
    private Integer durationSeconds;

    @JsonAlias({"licenseType", "license_type"})
    private String licenseType;

    @JsonAlias({"attribution"})
    private String attribution;

    @JsonAlias({"isDemo", "is_demo"})
    private Boolean isDemo;

    @JsonAlias({"isActive", "is_active"})
    private Boolean isActive;
}
