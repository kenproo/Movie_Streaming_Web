package com.truong2k4.movie_service.modules.search.service;

import com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse;
import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.movie.entity.MovieStatus;
import com.truong2k4.movie_service.modules.movie.mapper.MovieMapper;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import com.truong2k4.movie_service.modules.search.dto.request.SearchRequest;
import com.truong2k4.movie_service.modules.search.dto.response.SearchResponse;
import com.truong2k4.movie_service.modules.search.dto.response.SearchSuggestionResponse;
import com.truong2k4.movie_service.modules.search.entity.SearchHistory;
import com.truong2k4.movie_service.modules.search.repository.SearchHistoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchService {

    MovieRepository movieRepository;
    MovieMapper movieMapper;
    SearchHistoryRepository searchHistoryRepository;

    public SearchResponse search(SearchRequest request) {
        // Save search history if user is authenticated and keyword is not blank
        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            saveSearchHistory(request.getKeyword());
        }

        List<Movie> movies = movieRepository.findFilteredMovies(
                MovieStatus.PUBLISHED,
                request.getType(),
                request.getGenre(),
                request.getCountry(),
                request.getYear(),
                request.getReleaseStatus(),
                request.getKeyword()
        );

        // Sort
        if ("rating".equals(request.getSortBy())) {
            movies.sort(Comparator.comparingDouble(Movie::getRating).reversed());
        } else if ("view".equals(request.getSortBy())) {
            movies.sort(Comparator.comparingLong(Movie::getViews).reversed());
        } else {
            movies.sort(Comparator.comparing(Movie::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        }

        long total = movies.size();
        int totalPages = (int) Math.ceil((double) total / request.getSize());
        int from = request.getPage() * request.getSize();
        int to = Math.min(from + request.getSize(), (int) total);

        List<MovieSummaryResponse> paged = (from < total)
                ? movies.subList(from, to).stream().map(movieMapper::toSummaryResponse).collect(Collectors.toList())
                : List.of();

        return SearchResponse.builder()
                .movies(paged)
                .totalResults(total)
                .page(request.getPage())
                .size(request.getSize())
                .totalPages(totalPages)
                .build();
    }

    public SearchSuggestionResponse getSuggestions(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return SearchSuggestionResponse.builder().suggestions(List.of()).build();
        }
        List<Movie> movies = movieRepository.findFilteredMovies(
                MovieStatus.PUBLISHED, null, null, null, null, null, keyword);
        List<String> suggestions = movies.stream()
                .limit(10)
                .map(Movie::getTitle)
                .collect(Collectors.toList());
        return SearchSuggestionResponse.builder().suggestions(suggestions).build();
    }

    private void saveSearchHistory(String keyword) {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                SearchHistory history = SearchHistory.builder()
                        .keyword(keyword)
                        .createdAt(LocalDateTime.now())
                        .build();
                searchHistoryRepository.save(history);
            }
        } catch (Exception ignored) {
            // Non-critical
        }
    }
}
