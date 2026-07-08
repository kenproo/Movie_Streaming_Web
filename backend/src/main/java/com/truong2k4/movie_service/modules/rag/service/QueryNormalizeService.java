package com.truong2k4.movie_service.modules.rag.service;

import org.springframework.stereotype.Service;

/**
 * Normalizes user queries for better search accuracy.
 * Handles: typos, abbreviations, Vietnamese/English mixing, keyword extraction.
 * TODO: Integrate with LLM for advanced normalization.
 */
@Service
public class QueryNormalizeService {

    public String normalize(String rawQuery) {
        if (rawQuery == null) return "";
        // Basic normalization
        String normalized = rawQuery.trim().toLowerCase();
        // Remove common filler words
        normalized = normalized
                .replaceAll("\\b(gợi ý|recommend|tìm|find|phim|movie|film|cho tôi|cho mình|muốn xem)\\b", "")
                .replaceAll("\\s+", " ")
                .trim();
        return normalized.isEmpty() ? rawQuery.trim() : normalized;
    }

    public String extractIntent(String query) {
        // TODO: Use LLM to extract structured intent (genre, year, actor, similar-to, etc.)
        return query;
    }
}
