package com.truong2k4.movie_service.modules.movie.external.pexels.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PexelsVideoDto {
    private Long id;
    private Integer width;
    private Integer height;
    private Integer duration;
    private String url;
    private String image;
    private PexelsUserDto user;

    @JsonProperty("video_files")
    private List<PexelsVideoFileDto> videoFiles;
}
