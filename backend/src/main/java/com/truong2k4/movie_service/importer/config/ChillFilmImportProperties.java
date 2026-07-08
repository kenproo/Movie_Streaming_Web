package com.truong2k4.movie_service.importer.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "chillfilm.import")
@Getter
@Setter
public class ChillFilmImportProperties {
    private boolean enabled;
    private String dataDir;
    private String s3PublicBaseUrl;
    private boolean overwriteExisting;
    private String defaultStatus;
    private String defaultMovieType;
    private String defaultQuality;
    private String defaultLanguage;
}
