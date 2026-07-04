package com.truong2k4.movie_service.modules.movie.external.pexels;

import com.truong2k4.movie_service.modules.movie.exception.PexelsApiException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.movie.external.pexels.dto.PexelsVideoSearchResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@Slf4j
public class PexelsVideoClient {

    private final RestClient restClient;
    private final PexelsProperties pexelsProperties;

    public PexelsVideoClient(PexelsProperties pexelsProperties) {
        this.pexelsProperties = pexelsProperties;
        
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(5000);

        String baseUrl = pexelsProperties.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://api.pexels.com";
        }

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public PexelsVideoSearchResponse searchVideos(String query, int perPage) {
        if (!pexelsProperties.isEnabled() || pexelsProperties.getApiKey() == null || pexelsProperties.getApiKey().isBlank()) {
            log.warn("Pexels API is disabled or API key is not configured.");
            throw new PexelsApiException(ErrorCode.PEXELS_API_UNCONFIGURED);
        }

        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/videos/search")
                            .queryParam("query", query)
                            .queryParam("per_page", perPage)
                            .build())
                    .header("Authorization", pexelsProperties.getApiKey())
                    .retrieve()
                    .body(PexelsVideoSearchResponse.class);
        } catch (Exception e) {
            log.error("Error occurred while calling Pexels API: {}", e.getMessage());
            throw new PexelsApiException(ErrorCode.PEXELS_API_ERROR);
        }
    }
}
