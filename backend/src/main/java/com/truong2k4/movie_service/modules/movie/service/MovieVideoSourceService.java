package com.truong2k4.movie_service.modules.movie.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.movie.entity.MovieVideoSource;
import com.truong2k4.movie_service.modules.movie.entity.VideoProvider;
import com.truong2k4.movie_service.modules.movie.entity.VideoType;
import com.truong2k4.movie_service.modules.movie.exception.VideoSourceNotFoundException;
import com.truong2k4.movie_service.modules.movie.external.pexels.PexelsProperties;
import com.truong2k4.movie_service.modules.movie.external.pexels.PexelsVideoClient;
import com.truong2k4.movie_service.modules.movie.external.pexels.dto.PexelsVideoDto;
import com.truong2k4.movie_service.modules.movie.external.pexels.dto.PexelsVideoFileDto;
import com.truong2k4.movie_service.modules.movie.external.pexels.dto.PexelsVideoSearchResponse;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import com.truong2k4.movie_service.modules.movie.repository.MovieVideoSourceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MovieVideoSourceService {

    MovieRepository movieRepository;
    MovieVideoSourceRepository movieVideoSourceRepository;
    PexelsVideoClient pexelsVideoClient;
    PexelsProperties pexelsProperties;

    @Transactional
    public MovieVideoSource generatePexelsDemoVideo(UUID movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        String query = determineQuery(movie);
        log.info("Searching Pexels video for movie '{}' (ID: {}) with query: '{}'", movie.getTitle(), movieId, query);

        PexelsVideoSearchResponse response = pexelsVideoClient.searchVideos(query, 10);
        if (response == null || response.getVideos() == null || response.getVideos().isEmpty()) {
            log.warn("No videos returned from Pexels for query: {}", query);
            throw new VideoSourceNotFoundException(ErrorCode.VIDEO_SOURCE_NOT_FOUND);
        }

        PexelsVideoFileDto selectedFile = null;
        PexelsVideoDto selectedVideo = null;

        // Try to select an MP4 video file with HD resolution (width >= 1280 and height >= 720)
        for (PexelsVideoDto video : response.getVideos()) {
            if (video.getVideoFiles() == null) continue;
            for (PexelsVideoFileDto file : video.getVideoFiles()) {
                if (file.getLink() == null || file.getLink().isBlank()) continue;
                if ("video/mp4".equalsIgnoreCase(file.getFileType())) {
                    if (file.getWidth() != null && file.getWidth() >= 1280 &&
                            file.getHeight() != null && file.getHeight() >= 720) {
                        selectedFile = file;
                        selectedVideo = video;
                        break;
                    }
                }
            }
            if (selectedFile != null) break;
        }

        // Fallback 1: select the first mp4 file
        if (selectedFile == null) {
            for (PexelsVideoDto video : response.getVideos()) {
                if (video.getVideoFiles() == null) continue;
                for (PexelsVideoFileDto file : video.getVideoFiles()) {
                    if (file.getLink() == null || file.getLink().isBlank()) continue;
                    if ("video/mp4".equalsIgnoreCase(file.getFileType())) {
                        selectedFile = file;
                        selectedVideo = video;
                        break;
                    }
                }
                if (selectedFile != null) break;
            }
        }

        // Fallback 2: select the first available file
        if (selectedFile == null) {
            for (PexelsVideoDto video : response.getVideos()) {
                if (video.getVideoFiles() != null && !video.getVideoFiles().isEmpty()) {
                    selectedFile = video.getVideoFiles().get(0);
                    selectedVideo = video;
                    break;
                }
            }
        }

        if (selectedFile == null) {
            log.error("Could not find any valid video files in Pexels response");
            throw new VideoSourceNotFoundException(ErrorCode.VIDEO_SOURCE_NOT_FOUND);
        }

        // Deactivate old Pexels demo videos for this movie
        List<MovieVideoSource> existingSources = movieVideoSourceRepository.findByMovieIdAndIsActiveTrue(movieId);
        for (MovieVideoSource source : existingSources) {
            if (Boolean.TRUE.equals(source.getIsDemo()) && VideoProvider.PEXELS.equals(source.getProvider())) {
                source.setIsActive(false);
                movieVideoSourceRepository.save(source);
            }
        }

        String attribution = "Video from Pexels";
        if (selectedVideo.getUser() != null && selectedVideo.getUser().getName() != null) {
            attribution += " - " + selectedVideo.getUser().getName();
        }

        MovieVideoSource newSource = MovieVideoSource.builder()
                .movie(movie)
                .type(VideoType.PLACEHOLDER)
                .provider(VideoProvider.PEXELS)
                .videoUrl(selectedFile.getLink())
                .embedUrl(null)
                .quality(selectedFile.getQuality())
                .durationSeconds(selectedVideo.getDuration())
                .licenseType("PEXELS_LICENSE")
                .attribution(attribution)
                .isDemo(true)
                .isActive(true)
                .build();

        return movieVideoSourceRepository.save(newSource);
    }

    @Transactional
    public MovieVideoSource getBestVideoForMovie(UUID movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
        }

        List<MovieVideoSource> activeSources = movieVideoSourceRepository.findByMovieIdAndIsActiveTrue(movieId);

        // 1. Prefer active non-demo videos
        for (MovieVideoSource source : activeSources) {
            if (!Boolean.TRUE.equals(source.getIsDemo())) {
                return source;
            }
        }

        // 2. If not found, use active demo video
        for (MovieVideoSource source : activeSources) {
            if (Boolean.TRUE.equals(source.getIsDemo())) {
                return source;
            }
        }

        // 3. Auto-generate if Pexels is enabled
        if (pexelsProperties.isEnabled() && pexelsProperties.getApiKey() != null && !pexelsProperties.getApiKey().isBlank()) {
            try {
                return generatePexelsDemoVideo(movieId);
            } catch (Exception e) {
                log.error("Failed to auto-generate Pexels demo video for movie {}: {}", movieId, e.getMessage());
            }
        }

        throw new VideoSourceNotFoundException(ErrorCode.VIDEO_SOURCE_NOT_FOUND);
    }

    public List<MovieVideoSource> getVideoSources(UUID movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
        }
        return movieVideoSourceRepository.findByMovieIdAndIsActiveTrue(movieId);
    }

    private String determineQuery(Movie movie) {
        if (movie.getGenres() != null && !movie.getGenres().isEmpty()) {
            for (String genre : movie.getGenres()) {
                if (genre == null) continue;
                String upperGenre = genre.toUpperCase().trim();
                if (upperGenre.contains("ACTION")) {
                    return "cinematic action";
                } else if (upperGenre.contains("HORROR") || upperGenre.contains("SCARY")) {
                     return "dark forest scary";
                } else if (upperGenre.contains("ROMANCE") || upperGenre.contains("ROMANTIC")) {
                    return "romantic couple city";
                } else if (upperGenre.contains("SCIENCE") || upperGenre.contains("SCI-FI") || upperGenre.contains("SCIFI")) {
                    return "space futuristic city";
                } else if (upperGenre.contains("CRIME") || upperGenre.contains("THRILLER")) {
                    return "crime city night";
                } else if (upperGenre.contains("DRAMA")) {
                    return "cinematic people";
                } else if (upperGenre.contains("ADVENTURE")) {
                    return "mountain adventure";
                } else if (upperGenre.contains("ANIMATION") || upperGenre.contains("ANIME")) {
                    return "colorful animation background";
                }
            }
        }
        return "cinematic movie";
    }
}
