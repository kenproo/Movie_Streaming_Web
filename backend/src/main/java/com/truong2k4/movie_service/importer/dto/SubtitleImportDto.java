package com.truong2k4.movie_service.importer.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SubtitleImportDto {
    @JsonAlias({"id"})
    private UUID id;

    @JsonAlias({"episodeId", "episode_id"})
    private UUID episodeId;

    @JsonAlias({"episodeNumber", "episode_number"})
    private Integer episodeNumber;

    @JsonAlias({"movieId", "movie_id"})
    private UUID movieId;

    @JsonAlias({"movieSlug", "movie_slug"})
    private String movieSlug;

    @JsonAlias({"language"})
    private String language;

    @JsonAlias({"format"})
    private String format;

    @JsonAlias({"subtitleUrl", "subtitle_url"})
    private String subtitleUrl;

    @JsonAlias({"storageKey", "storage_key"})
    private String storageKey;

    @JsonAlias({"sourceProvider", "source_provider"})
    private String sourceProvider;

    @JsonAlias({"licenseType", "license_type"})
    private String licenseType;
}
