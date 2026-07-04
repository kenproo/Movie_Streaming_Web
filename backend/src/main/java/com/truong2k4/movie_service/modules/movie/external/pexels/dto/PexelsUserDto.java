package com.truong2k4.movie_service.modules.movie.external.pexels.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PexelsUserDto {
    private Long id;
    private String name;
    private String url;
}
