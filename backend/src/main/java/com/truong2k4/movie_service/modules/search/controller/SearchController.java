package com.truong2k4.movie_service.modules.search.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.movie.entity.MovieType;
import com.truong2k4.movie_service.modules.movie.entity.ReleaseStatus;
import com.truong2k4.movie_service.modules.search.dto.request.SearchRequest;
import com.truong2k4.movie_service.modules.search.dto.response.SearchResponse;
import com.truong2k4.movie_service.modules.search.dto.response.SearchSuggestionResponse;
import com.truong2k4.movie_service.modules.search.service.SearchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchController {

    SearchService searchService;

    @GetMapping
    public ApiResponse<SearchResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) MovieType type,
            @RequestParam(required = false) ReleaseStatus releaseStatus,
            @RequestParam(required = false, defaultValue = "latest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        SearchRequest request = SearchRequest.builder()
                .keyword(keyword)
                .genre(genre)
                .country(country)
                .year(year)
                .type(type)
                .releaseStatus(releaseStatus)
                .sortBy(sortBy)
                .page(page)
                .size(size)
                .build();

        return ApiResponse.<SearchResponse>builder()
                .result(searchService.search(request))
                .build();
    }

    @GetMapping("/suggestions")
    public ApiResponse<SearchSuggestionResponse> suggestions(
            @RequestParam String keyword) {
        return ApiResponse.<SearchSuggestionResponse>builder()
                .result(searchService.getSuggestions(keyword))
                .build();
    }
}
