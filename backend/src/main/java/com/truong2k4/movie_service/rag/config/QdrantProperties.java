package com.truong2k4.movie_service.rag.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "qdrant")
@Getter
@Setter
public class QdrantProperties {
    private String url;
    private String collectionName;
}
