package com.truong2k4.movie_service.importer.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class EpisodeSourceImportDto {
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

    @JsonAlias({"serverName", "server_name", "server"})
    private String serverName;

    @JsonAlias({"quality"})
    private String quality;

    @JsonAlias({"videoUrl", "video_url"})
    private String videoUrl;

    @JsonAlias({"subtitleUrl", "subtitle_url"})
    private String subtitleUrl;

    @JsonAlias({"isDefault", "is_default"})
    private Boolean isDefault;

    @JsonAlias({"provider"})
    private String provider;

    @JsonAlias({"embedUrl", "embed_url"})
    private String embedUrl;

    @JsonAlias({"storageKey", "storage_key"})
    private String storageKey;

    @JsonAlias({"isActive", "is_active"})
    private Boolean isActive;

    @JsonAlias({"isDemo", "is_demo"})
    private Boolean isDemo;

    @JsonAlias({"licenseType", "license_type"})
    private String licenseType;

    @JsonAlias({"attribution"})
    private String attribution;
}
