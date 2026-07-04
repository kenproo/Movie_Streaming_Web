package com.truong2k4.movie_service.modules.movie.external.pexels.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PexelsVideoFileDto {
    private Long id;
    private String quality;
    
    @JsonProperty("file_type")
    private String fileType;
    
    private Integer width;
    private Integer height;
    private String link;
}
