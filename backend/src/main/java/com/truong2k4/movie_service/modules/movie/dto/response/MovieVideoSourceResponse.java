package com.truong2k4.movie_service.modules.movie.dto.response;

import com.truong2k4.movie_service.modules.movie.entity.VideoProvider;
import com.truong2k4.movie_service.modules.movie.entity.VideoType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieVideoSourceResponse {
    Long id;
    UUID movieId;
    VideoType type;
    VideoProvider provider;
    String videoUrl;
    String embedUrl;
    String quality;
    Integer durationSeconds;
    String licenseType;
    String attribution;
    Boolean isDemo;
    Boolean isActive;
}
