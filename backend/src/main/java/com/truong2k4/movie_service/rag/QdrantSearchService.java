package com.truong2k4.movie_service.rag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.truong2k4.movie_service.rag.config.QdrantProperties;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QdrantSearchService {

    private final QdrantProperties qdrantProperties;

    /**
     * Search similar movies in Qdrant.
     * TODO: Integrate with an embedding model to vectorize the query
     * and query Qdrant using the Qdrant Java Client or HTTP API.
     */
    public List<MovieSearchResult> searchSimilarMovies(String query, int limit) {
        log.info("Searching similar movies for query: '{}' with limit: {}", query, limit);
        // Currently returns an empty skeleton list as requested
        return new ArrayList<>();
    }
}
