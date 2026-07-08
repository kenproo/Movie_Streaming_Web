package com.truong2k4.movie_service.modules.rag.service;

import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.rag.dto.request.ChatRequest;
import com.truong2k4.movie_service.modules.rag.dto.response.ChatResponse;
import com.truong2k4.movie_service.modules.rag.dto.response.MovieRecommendationResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RagChatService {

    QueryNormalizeService queryNormalizeService;
    MovieRetrievalService movieRetrievalService;
    RerankService rerankService;

    public ChatResponse chat(ChatRequest request) {
        // Step 1: Normalize query
        String normalizedQuery = queryNormalizeService.normalize(request.getMessage());

        // Step 2: Retrieve candidates
        List<Movie> candidates = movieRetrievalService.retrieve(normalizedQuery, 20);

        // Step 3: Rerank
        List<Movie> reranked = rerankService.rerank(candidates, normalizedQuery);

        // Step 4: Build recommendations
        List<MovieRecommendationResponse> recommendations = reranked.stream()
                .map(m -> MovieRecommendationResponse.builder()
                        .id(m.getId())
                        .title(m.getTitle())
                        .slug(m.getSlug())
                        .posterUrl(m.getPosterUrl())
                        .rating(m.getRating())
                        .year(m.getYear())
                        .reason("Matches your search: " + normalizedQuery)
                        .score(m.getRating())
                        .build())
                .collect(Collectors.toList());

        // Step 5: Generate answer
        // TODO: Replace with actual LLM call
        String answer = buildAnswer(normalizedQuery, reranked);

        return ChatResponse.builder()
                .answer(answer)
                .recommendations(recommendations)
                .sessionId(request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString())
                .build();
    }

    private String buildAnswer(String query, List<Movie> movies) {
        if (movies.isEmpty()) {
            return "Xin lỗi, tôi không tìm thấy phim phù hợp với yêu cầu '" + query + "'. Hãy thử từ khóa khác.";
        }
        StringBuilder sb = new StringBuilder("Dựa trên yêu cầu của bạn, tôi gợi ý ");
        sb.append(movies.size()).append(" phim: ");
        movies.stream().limit(3).forEach(m -> sb.append("\"").append(m.getTitle()).append("\", "));
        sb.delete(sb.length() - 2, sb.length()); // delete last comma
        sb.append(" và một số phim khác. Hãy chọn phim bạn thích!");
        // TODO: Use LLM to generate a more natural answer
        return sb.toString();
    }
}
