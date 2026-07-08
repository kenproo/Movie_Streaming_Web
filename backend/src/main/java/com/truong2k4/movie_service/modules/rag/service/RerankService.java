package com.truong2k4.movie_service.modules.rag.service;

import com.truong2k4.movie_service.modules.movie.entity.Movie;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Reranks retrieved movies before returning to user.
 * TODO: Implement cross-encoder or LLM-based reranking.
 */
@Service
public class RerankService {

    public List<Movie> rerank(List<Movie> candidates, String query) {
        // TODO: Score each candidate against the query using cross-encoder
        // For now: sort by rating desc as baseline
        return candidates.stream()
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .limit(5)
                .collect(Collectors.toList());
    }
}
