package com.truong2k4.movie_service.modules.rag.service;

import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.movie.entity.MovieStatus;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Retrieves candidate movies for RAG pipeline.
 * Falls back to DB search when vector store is not available.
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieRetrievalService {

    MovieRepository movieRepository;

    public List<Movie> retrieve(String normalizedQuery, int topK) {
        // TODO: When VectorSearchClient is ready, replace with vector similarity search
        List<Movie> results = movieRepository.findFilteredMovies(
                MovieStatus.PUBLISHED, null, null, null, null, null, normalizedQuery);
        return results.stream().limit(topK).collect(Collectors.toList());
    }
}
