package com.truong2k4.movie_service.modules.movie.external.pexels;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "external.pexels")
@Getter
@Setter
public class PexelsProperties {
    private String apiKey;
    private String baseUrl;
    private boolean enabled;
}
