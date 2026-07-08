package com.truong2k4.movie_service.modules.rag.client;

import java.util.List;
import java.util.UUID;

/**
 * Interface for vector search (Qdrant / pgvector).
 * TODO: Implement with actual Qdrant REST client when Qdrant is available.
 */
public interface VectorSearchClient {

    /**
     * Search for similar movie IDs given a query embedding vector.
     *
     * @param queryVector the embedding vector of the query
     * @param topK        number of results to return
     * @return list of movie IDs ordered by similarity score
     */
    List<UUID> searchSimilar(float[] queryVector, int topK);

    /**
     * Upsert a movie document embedding into the vector store.
     *
     * @param movieId  the movie UUID
     * @param vector   the embedding vector
     * @param metadata optional metadata map
     */
    void upsert(UUID movieId, float[] vector, java.util.Map<String, Object> metadata);
}
