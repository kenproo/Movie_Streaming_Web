package com.truong2k4.movie_service.modules.movie.external.pexels.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PexelsVideoSearchResponse {
    private List<PexelsVideoDto> videos;
}
