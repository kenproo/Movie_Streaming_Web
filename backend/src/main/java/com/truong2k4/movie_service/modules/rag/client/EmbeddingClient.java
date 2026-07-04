package com.truong2k4.movie_service.modules.rag.client;

/**
 * Interface for embedding models (OpenAI, HuggingFace, etc.).
 * TODO: Implement with actual embedding API when available.
 */
public interface EmbeddingClient {

    /**
     * Generate embedding vector for the given text.
     *
     * @param text input text (Vietnamese or English)
     * @return float array representing the embedding
     */
    float[] embed(String text);
}
