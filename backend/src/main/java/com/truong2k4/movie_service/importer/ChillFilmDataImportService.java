package com.truong2k4.movie_service.importer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.truong2k4.movie_service.importer.config.ChillFilmImportProperties;
import com.truong2k4.movie_service.importer.dto.*;
import com.truong2k4.movie_service.modules.movie.entity.*;
import com.truong2k4.movie_service.modules.movie.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class ChillFilmDataImportService {

    private final ChillFilmImportProperties importProperties;
    private final MovieRepository movieRepository;
    private final EpisodeRepository episodeRepository;
    private final EpisodeSourceRepository episodeSourceRepository;
    private final SubtitleRepository subtitleRepository;
    private final MovieVideoSourceRepository movieVideoSourceRepository;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public ChillFilmDataImportService(
            ChillFilmImportProperties importProperties,
            MovieRepository movieRepository,
            EpisodeRepository episodeRepository,
            EpisodeSourceRepository episodeSourceRepository,
            SubtitleRepository subtitleRepository,
            MovieVideoSourceRepository movieVideoSourceRepository,
            JdbcTemplate jdbcTemplate) {
        this.importProperties = importProperties;
        this.movieRepository = movieRepository;
        this.episodeRepository = episodeRepository;
        this.episodeSourceRepository = episodeSourceRepository;
        this.subtitleRepository = subtitleRepository;
        this.movieVideoSourceRepository = movieVideoSourceRepository;
        this.jdbcTemplate = jdbcTemplate;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        this.objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
    }

    public ImportResult dryRun() {
        log.info("Starting dry-run import process...");
        List<ImportResult> results = new ArrayList<>();
        results.add(importMoviesInternal(true));
        results.add(importEpisodesInternal(true));
        results.add(importEpisodeSourcesInternal(true));
        results.add(importSubtitlesInternal(true));
        results.add(importMovieVideoSourcesInternal(true));
        return ImportResult.merge(results, "Dry-run validation completed successfully");
    }

    @Transactional
    public ImportResult importAll() {
        log.info("Starting import-all process...");
        List<ImportResult> results = new ArrayList<>();
        
        // Order of import is critical: Movie -> Episode -> EpisodeSource -> Subtitle -> MovieVideoSource
        results.add(importMoviesInternal(false));
        results.add(importEpisodesInternal(false));
        results.add(importEpisodeSourcesInternal(false));
        results.add(importSubtitlesInternal(false));
        results.add(importMovieVideoSourcesInternal(false));

        return ImportResult.merge(results, "Import all steps finished");
    }

    @Transactional
    public ImportResult importMovies() {
        return importMoviesInternal(false);
    }

    @Transactional
    public ImportResult importEpisodes() {
        return importEpisodesInternal(false);
    }

    @Transactional
    public ImportResult importEpisodeSources() {
        return importEpisodeSourcesInternal(false);
    }

    @Transactional
    public ImportResult importSubtitles() {
        return importSubtitlesInternal(false);
    }

    @Transactional
    public ImportResult importMovieVideoSources() {
        return importMovieVideoSourcesInternal(false);
    }

    private File getImportFile(String filename) {
        Path dataDir = Paths.get(importProperties.getDataDir());
        return dataDir.resolve(filename).toFile();
    }

    private byte[] toBytes(UUID uuid) {
        if (uuid == null) return null;
        ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
        bb.putLong(uuid.getMostSignificantBits());
        bb.putLong(uuid.getLeastSignificantBits());
        return bb.array();
    }

    private ImportResult importMoviesInternal(boolean dryRun) {
        String filename = "movies_mysql.json";
        File file = getImportFile(filename);
        if (!file.exists()) {
            return errorResult("File not found: " + file.getAbsolutePath());
        }

        int total = 0, created = 0, updated = 0, skipped = 0, failed = 0;
        List<String> errors = new ArrayList<>();

        try {
            List<MovieImportDto> dtos = objectMapper.readValue(file, new TypeReference<List<MovieImportDto>>() {});
            total = dtos.size();

            for (MovieImportDto dto : dtos) {
                try {
                    // ID / Slug / TMDB ID / IMDB ID resolution
                    Movie existing = null;
                    if (dto.getId() != null) {
                        existing = movieRepository.findById(dto.getId()).orElse(null);
                    }
                    if (existing == null && dto.getTmdbId() != null && !dto.getTmdbId().trim().isEmpty()) {
                        existing = movieRepository.findByTmdbId(dto.getTmdbId().trim()).orElse(null);
                    }
                    if (existing == null && dto.getImdbId() != null && !dto.getImdbId().trim().isEmpty()) {
                        existing = movieRepository.findByImdbId(dto.getImdbId().trim()).orElse(null);
                    }
                    if (existing == null && dto.getSlug() != null && !dto.getSlug().trim().isEmpty()) {
                        existing = movieRepository.findBySlug(dto.getSlug().trim()).orElse(null);
                    }

                    boolean isUpdate = (existing != null);
                    UUID id = isUpdate ? existing.getId() : (dto.getId() != null ? dto.getId() : UUID.randomUUID());
                    String slug = dto.getSlug();
                    if (slug == null || slug.trim().isEmpty()) {
                        slug = generateSlug(dto.getTitle(), dto.getYear() != null ? dto.getYear() : 2026);
                    }
                    slug = slug.trim();
                    String title = dto.getTitle() != null ? dto.getTitle().trim() : "Untitled Movie";

                    // Year parsing
                    int year = parseYear(dto.getReleaseDate(), dto.getYear());

                    if (!dryRun && !isUpdate) {
                        // Perform raw insert with only database-required non-nullable columns
                        jdbcTemplate.update(
                            "INSERT INTO movies (id, slug, title, current_episode, total_episodes, rating, views, year) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            toBytes(id), slug, title, 1, 1, 0.0, 0L, year
                        );
                    }

                    Movie movie = movieRepository.findById(id).orElseGet(Movie::new);
                    movie.setSlug(slug);
                    movie.setTitle(title);
                    movie.setOriginalTitle(dto.getOriginalTitle() != null ? dto.getOriginalTitle().trim() : null);
                    movie.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
                    movie.setYear(year);
                    movie.setCountry(dto.getCountry() != null ? dto.getCountry().trim() : "Vietnam");

                    // MovieType enum
                    MovieType movieType = MovieType.SINGLE;
                    if (dto.getType() != null) {
                        try {
                            movieType = MovieType.valueOf(dto.getType().toUpperCase());
                        } catch (Exception e) {
                            try {
                                movieType = MovieType.valueOf(importProperties.getDefaultMovieType().toUpperCase());
                            } catch (Exception ex) {}
                        }
                    } else {
                        try {
                            movieType = MovieType.valueOf(importProperties.getDefaultMovieType().toUpperCase());
                        } catch (Exception ex) {}
                    }
                    movie.setType(movieType);

                    // Quality & Language
                    movie.setDisplayQuality(dto.getQuality() != null ? dto.getQuality().trim() : importProperties.getDefaultQuality());
                    movie.setDisplayLanguage(dto.getLanguage() != null ? dto.getLanguage().trim() : importProperties.getDefaultLanguage());

                    // Rating
                    movie.setRating(dto.getRating() != null ? dto.getRating() : 0.0);

                    // Duration formatting
                    String durationStr = dto.getDuration();
                    if (durationStr != null && !durationStr.trim().isEmpty()) {
                        String cleanDur = durationStr.trim();
                        if (cleanDur.matches("\\d+")) {
                            durationStr = cleanDur + " phút";
                        }
                    }
                    movie.setDuration(durationStr);

                    movie.setTotalEpisodes(dto.getTotalEpisodes() != null ? dto.getTotalEpisodes() : 1);
                    movie.setCurrentEpisode(dto.getCurrentEpisode() != null ? dto.getCurrentEpisode() : 1);

                    // Release status & Movie status
                    movie.setReleaseStatus(parseReleaseStatus(dto.getReleaseDate(), dto.getReleaseStatus()));
                    
                    MovieStatus mStatus = MovieStatus.PUBLISHED;
                    if (dto.getStatus() != null) {
                        try {
                            mStatus = MovieStatus.valueOf(dto.getStatus().toUpperCase());
                        } catch (Exception e) {
                            try {
                                mStatus = MovieStatus.valueOf(importProperties.getDefaultStatus().toUpperCase());
                            } catch (Exception ex) {}
                        }
                    } else {
                        try {
                            mStatus = MovieStatus.valueOf(importProperties.getDefaultStatus().toUpperCase());
                        } catch (Exception ex) {}
                    }
                    movie.setStatus(mStatus);

                    movie.setViews(dto.getViews() != null ? dto.getViews() : 0L);

                    // Resolve Poster S3 URL
                    movie.setPosterUrl(resolvePosterUrl(dto));
                    movie.setBackdropUrl(dto.getBackdropUrl());
                    movie.setTrailerUrl(dto.getTrailerUrl());

                    // Anime Season
                    if (movie.getType() == MovieType.ANIME) {
                        movie.setAnimeSeason(AnimeSeason.FALL); // default fallback
                    } else {
                        movie.setAnimeSeason(null);
                    }

                    movie.setTmdbId(dto.getTmdbId() != null ? dto.getTmdbId().trim() : null);
                    movie.setImdbId(dto.getImdbId() != null ? dto.getImdbId().trim() : null);
                    movie.setDirector(dto.getDirector() != null ? dto.getDirector().trim() : null);
                    movie.setWriter(dto.getWriter() != null ? dto.getWriter().trim() : null);
                    movie.setStudio(dto.getStudio() != null ? dto.getStudio().trim() : null);
                    movie.setAgeRating(dto.getAgeRating() != null ? dto.getAgeRating().trim() : null);
                    movie.setPopularity(dto.getPopularity() != null ? dto.getPopularity() : 0.0);

                    // Parse arrays
                    movie.setKeywords(parseStringList(dto.getKeywords()));
                    movie.setGenres(parseStringList(dto.getGenres()));
                    movie.setCast(parseStringList(dto.getCast()));

                    // Tags combination
                    List<String> combinedTags = parseStringList(dto.getTags());
                    if (combinedTags.isEmpty()) {
                        if (movie.getGenres() != null) combinedTags.addAll(movie.getGenres());
                        if (movie.getCountry() != null) combinedTags.add(movie.getCountry());
                    }
                    movie.setTags(combinedTags);

                    if (!dryRun) {
                        movieRepository.save(movie);
                    }

                    if (isUpdate) {
                        updated++;
                    } else {
                        created++;
                    }
                } catch (Exception e) {
                    failed++;
                    if (errors.size() < 20) {
                        errors.add("Movie slug: " + dto.getSlug() + " failed: " + e.getMessage());
                    }
                    log.error("Failed to map Movie: {}", dto.getSlug(), e);
                }
            }
        } catch (IOException e) {
            log.error("Error reading {}", filename, e);
            return errorResult("Error reading movies JSON: " + e.getMessage());
        }

        return buildResult(true, "Movie import finished", total, created, updated, skipped, failed, errors);
    }

    private ImportResult importEpisodesInternal(boolean dryRun) {
        String filename = "episodes_mysql.json";
        File file = getImportFile(filename);
        if (!file.exists()) {
            return errorResult("File not found: " + file.getAbsolutePath());
        }

        int total = 0, created = 0, updated = 0, skipped = 0, failed = 0;
        List<String> errors = new ArrayList<>();

        try {
            List<EpisodeImportDto> dtos = objectMapper.readValue(file, new TypeReference<List<EpisodeImportDto>>() {});
            total = dtos.size();

            for (EpisodeImportDto dto : dtos) {
                try {
                    // Find Movie
                    Movie movie = findMovieByDtoIdentifiers(dto.getMovieId(), dto.getMovieSlug(), dto.getMovieTmdbId(), dto.getMovieImdbId());
                    if (movie == null) {
                        skipped++;
                        if (errors.size() < 20) {
                            errors.add("Skip Episode, movie not found for movie slug: " + dto.getMovieSlug() + ", movieId: " + dto.getMovieId());
                        }
                        continue;
                    }

                    int epNum = dto.getEpisodeNumber() != null ? dto.getEpisodeNumber() : 1;
                    Episode existing = episodeRepository.findByMovieIdAndEpisodeNumber(movie.getId(), epNum).orElse(null);
                    boolean isUpdate = (existing != null);
                    UUID id = isUpdate ? existing.getId() : (dto.getId() != null ? dto.getId() : UUID.randomUUID());
                    String epTitle = dto.getTitle() != null ? dto.getTitle().trim() : "Tập " + epNum;

                    if (!dryRun && !isUpdate) {
                        jdbcTemplate.update(
                            "INSERT INTO episodes (id, episode_number, movie_id) VALUES (?, ?, ?)",
                            toBytes(id), epNum, toBytes(movie.getId())
                        );
                    }

                    Episode episode = episodeRepository.findById(id).orElseGet(Episode::new);
                    episode.setMovie(movie);
                    episode.setEpisodeNumber(epNum);
                    episode.setSeasonNumber(dto.getSeasonNumber() != null ? dto.getSeasonNumber() : 1);
                    episode.setTitle(epTitle);
                    episode.setSummary(dto.getSummary() != null ? dto.getSummary().trim() : null);
                    episode.setDuration(dto.getDuration() != null ? dto.getDuration().trim() : null);
                    episode.setThumbnailUrl(dto.getThumbnailUrl() != null ? dto.getThumbnailUrl().trim() : null);
                    episode.setReleasedAt(parseLocalDateTime(dto.getReleasedAt()));

                    if (!dryRun) {
                        episodeRepository.save(episode);
                    }

                    if (isUpdate) {
                        updated++;
                    } else {
                        created++;
                    }
                } catch (Exception e) {
                    failed++;
                    if (errors.size() < 20) {
                        errors.add("Episode mapping failed: " + e.getMessage());
                    }
                    log.error("Failed to map Episode for movie slug: {}", dto.getMovieSlug(), e);
                }
            }
        } catch (IOException e) {
            log.error("Error reading {}", filename, e);
            return errorResult("Error reading episodes JSON: " + e.getMessage());
        }

        return buildResult(true, "Episode import finished", total, created, updated, skipped, failed, errors);
    }

    private ImportResult importEpisodeSourcesInternal(boolean dryRun) {
        String filename = "episode_sources_mysql.json";
        File file = getImportFile(filename);
        if (!file.exists()) {
            return errorResult("File not found: " + file.getAbsolutePath());
        }

        int total = 0, created = 0, updated = 0, skipped = 0, failed = 0;
        List<String> errors = new ArrayList<>();

        try {
            List<EpisodeSourceImportDto> dtos = objectMapper.readValue(file, new TypeReference<List<EpisodeSourceImportDto>>() {});
            total = dtos.size();

            for (EpisodeSourceImportDto dto : dtos) {
                try {
                    Episode episode = null;
                    if (dto.getEpisodeId() != null) {
                        episode = episodeRepository.findById(dto.getEpisodeId()).orElse(null);
                    }
                    if (episode == null && (dto.getMovieId() != null || dto.getMovieSlug() != null) && dto.getEpisodeNumber() != null) {
                        Movie movie = findMovieByDtoIdentifiers(dto.getMovieId(), dto.getMovieSlug(), null, null);
                        if (movie != null) {
                            episode = episodeRepository.findByMovieIdAndEpisodeNumber(movie.getId(), dto.getEpisodeNumber()).orElse(null);
                        }
                    }

                    if (episode == null) {
                        skipped++;
                        if (errors.size() < 20) {
                            errors.add("Skip EpisodeSource, episode not found (episodeId: " + dto.getEpisodeId() + ")");
                        }
                        continue;
                    }

                    String serverName = dto.getServerName() != null ? dto.getServerName().trim() : "Default Server";
                    String quality = dto.getQuality() != null ? dto.getQuality().trim() : "HD";

                    EpisodeSource existing = episodeSourceRepository.findByEpisodeIdAndServerNameAndQuality(episode.getId(), serverName, quality).orElse(null);
                    boolean isUpdate = (existing != null);
                    UUID id = isUpdate ? existing.getId() : (dto.getId() != null ? dto.getId() : UUID.randomUUID());

                    if (!dryRun && !isUpdate) {
                        jdbcTemplate.update(
                            "INSERT INTO episode_sources (id, quality, server_name, video_url, episode_id) VALUES (?, ?, ?, ?, ?)",
                            toBytes(id), quality, serverName, "", toBytes(episode.getId())
                        );
                    }

                    EpisodeSource source = episodeSourceRepository.findById(id).orElseGet(EpisodeSource::new);
                    source.setEpisode(episode);
                    source.setServerName(serverName);
                    source.setQuality(quality);
                    source.setVideoUrl(dto.getVideoUrl() != null ? dto.getVideoUrl() : ""); // fallback
                    source.setSubtitleUrl(dto.getSubtitleUrl());
                    source.setIsDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false);
                    
                    // Enums & additional fields
                    VideoProvider provider = VideoProvider.LOCAL;
                    if (dto.getProvider() != null) {
                        try {
                            provider = VideoProvider.valueOf(dto.getProvider().toUpperCase());
                        } catch (Exception ex) {}
                    }
                    source.setProvider(provider);
                    source.setEmbedUrl(dto.getEmbedUrl());
                    source.setStorageKey(dto.getStorageKey());
                    source.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
                    source.setIsDemo(dto.getIsDemo() != null ? dto.getIsDemo() : false);
                    source.setLicenseType(dto.getLicenseType());
                    source.setAttribution(dto.getAttribution());

                    if (!dryRun) {
                        episodeSourceRepository.save(source);
                    }

                    if (isUpdate) {
                        updated++;
                    } else {
                        created++;
                    }
                } catch (Exception e) {
                    failed++;
                    if (errors.size() < 20) {
                        errors.add("EpisodeSource mapping failed: " + e.getMessage());
                    }
                    log.error("Failed to map EpisodeSource: ", e);
                }
            }
        } catch (IOException e) {
            log.error("Error reading {}", filename, e);
            return errorResult("Error reading episode sources JSON: " + e.getMessage());
        }

        return buildResult(true, "Episode source import finished", total, created, updated, skipped, failed, errors);
    }

    private ImportResult importSubtitlesInternal(boolean dryRun) {
        String filename = "subtitles_mysql.json";
        File file = getImportFile(filename);
        if (!file.exists()) {
            return errorResult("File not found: " + file.getAbsolutePath());
        }

        int total = 0, created = 0, updated = 0, skipped = 0, failed = 0;
        List<String> errors = new ArrayList<>();

        try {
            List<SubtitleImportDto> dtos = objectMapper.readValue(file, new TypeReference<List<SubtitleImportDto>>() {});
            total = dtos.size();

            for (SubtitleImportDto dto : dtos) {
                try {
                    Episode episode = null;
                    if (dto.getEpisodeId() != null) {
                        episode = episodeRepository.findById(dto.getEpisodeId()).orElse(null);
                    }
                    if (episode == null && (dto.getMovieId() != null || dto.getMovieSlug() != null) && dto.getEpisodeNumber() != null) {
                        Movie movie = findMovieByDtoIdentifiers(dto.getMovieId(), dto.getMovieSlug(), null, null);
                        if (movie != null) {
                            episode = episodeRepository.findByMovieIdAndEpisodeNumber(movie.getId(), dto.getEpisodeNumber()).orElse(null);
                        }
                    }

                    if (episode == null) {
                        skipped++;
                        if (errors.size() < 20) {
                            errors.add("Skip Subtitle, episode not found (episodeId: " + dto.getEpisodeId() + ")");
                        }
                        continue;
                    }

                    String language = dto.getLanguage() != null ? dto.getLanguage().trim() : "English";
                    String format = dto.getFormat() != null ? dto.getFormat().trim() : "vtt";

                    Subtitle existing = subtitleRepository.findByEpisodeIdAndLanguageAndFormat(episode.getId(), language, format).orElse(null);
                    boolean isUpdate = (existing != null);
                    UUID id = isUpdate ? existing.getId() : (dto.getId() != null ? dto.getId() : UUID.randomUUID());

                    if (!dryRun && !isUpdate) {
                        jdbcTemplate.update(
                            "INSERT INTO subtitles (id, format, language, subtitle_url, episode_id) VALUES (?, ?, ?, ?, ?)",
                            toBytes(id), format, language, "", toBytes(episode.getId())
                        );
                    }

                    Subtitle subtitle = subtitleRepository.findById(id).orElseGet(Subtitle::new);
                    subtitle.setEpisode(episode);
                    subtitle.setLanguage(language);
                    subtitle.setFormat(format);
                    subtitle.setSubtitleUrl(dto.getSubtitleUrl() != null ? dto.getSubtitleUrl().trim() : "");
                    subtitle.setStorageKey(dto.getStorageKey());
                    subtitle.setSourceProvider(dto.getSourceProvider());
                    subtitle.setLicenseType(dto.getLicenseType());

                    if (!dryRun) {
                        subtitleRepository.save(subtitle);
                    }

                    if (isUpdate) {
                        updated++;
                    } else {
                        created++;
                    }
                } catch (Exception e) {
                    failed++;
                    if (errors.size() < 20) {
                        errors.add("Subtitle mapping failed: " + e.getMessage());
                    }
                    log.error("Failed to map Subtitle: ", e);
                }
            }
        } catch (IOException e) {
            log.error("Error reading {}", filename, e);
            return errorResult("Error reading subtitles JSON: " + e.getMessage());
        }

        return buildResult(true, "Subtitle import finished", total, created, updated, skipped, failed, errors);
    }

    private ImportResult importMovieVideoSourcesInternal(boolean dryRun) {
        String filename = "movie_video_sources_mysql.json";
        File file = getImportFile(filename);
        if (!file.exists()) {
            return errorResult("File not found: " + file.getAbsolutePath());
        }

        int total = 0, created = 0, updated = 0, skipped = 0, failed = 0;
        List<String> errors = new ArrayList<>();

        try {
            List<MovieVideoSourceImportDto> dtos = objectMapper.readValue(file, new TypeReference<List<MovieVideoSourceImportDto>>() {});
            total = dtos.size();

            for (MovieVideoSourceImportDto dto : dtos) {
                try {
                    Movie movie = findMovieByDtoIdentifiers(dto.getMovieId(), dto.getMovieSlug(), dto.getMovieTmdbId(), dto.getMovieImdbId());
                    if (movie == null) {
                        skipped++;
                        if (errors.size() < 20) {
                            errors.add("Skip MovieVideoSource, movie not found (movieId: " + dto.getMovieId() + ", slug: " + dto.getMovieSlug() + ")");
                        }
                        continue;
                    }

                    VideoType vType = VideoType.TRAILER;
                    if (dto.getType() != null) {
                        try {
                            vType = VideoType.valueOf(dto.getType().toUpperCase());
                        } catch (Exception ex) {}
                    }

                    VideoProvider provider = VideoProvider.YOUTUBE;
                    if (dto.getProvider() != null) {
                        try {
                            provider = VideoProvider.valueOf(dto.getProvider().toUpperCase());
                        } catch (Exception ex) {}
                    }

                    String vUrl = dto.getVideoUrl() != null ? dto.getVideoUrl().trim() : "";

                    MovieVideoSource existing = movieVideoSourceRepository.findByMovieIdAndTypeAndProviderAndVideoUrl(movie.getId(), vType, provider, vUrl).orElse(null);
                    boolean isUpdate = (existing != null);

                    MovieVideoSource source = isUpdate ? existing : new MovieVideoSource();
                    if (!isUpdate && dto.getId() != null) {
                        source.setId(dto.getId());
                    }

                    source.setMovie(movie);
                    source.setType(vType);
                    source.setProvider(provider);
                    source.setVideoUrl(vUrl);
                    source.setEmbedUrl(dto.getEmbedUrl());
                    source.setStorageKey(dto.getStorageKey());
                    source.setQuality(dto.getQuality());
                    source.setDurationSeconds(dto.getDurationSeconds());
                    source.setLicenseType(dto.getLicenseType());
                    source.setAttribution(dto.getAttribution());
                    source.setIsDemo(dto.getIsDemo() != null ? dto.getIsDemo() : false);
                    source.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

                    if (!dryRun) {
                        movieVideoSourceRepository.save(source);
                    }

                    if (isUpdate) {
                        updated++;
                    } else {
                        created++;
                    }
                } catch (Exception e) {
                    failed++;
                    if (errors.size() < 20) {
                        errors.add("MovieVideoSource mapping failed: " + e.getMessage());
                    }
                    log.error("Failed to map MovieVideoSource: ", e);
                }
            }
        } catch (IOException e) {
            log.error("Error reading {}", filename, e);
            return errorResult("Error reading movie video sources JSON: " + e.getMessage());
        }

        return buildResult(true, "Movie video sources import finished", total, created, updated, skipped, failed, errors);
    }

    private Movie findMovieByDtoIdentifiers(UUID id, String slug, String tmdbId, String imdbId) {
        if (id != null) {
            Optional<Movie> m = movieRepository.findById(id);
            if (m.isPresent()) return m.get();
        }
        if (tmdbId != null && !tmdbId.trim().isEmpty()) {
            Optional<Movie> m = movieRepository.findByTmdbId(tmdbId.trim());
            if (m.isPresent()) return m.get();
        }
        if (imdbId != null && !imdbId.trim().isEmpty()) {
            Optional<Movie> m = movieRepository.findByImdbId(imdbId.trim());
            if (m.isPresent()) return m.get();
        }
        if (slug != null && !slug.trim().isEmpty()) {
            Optional<Movie> m = movieRepository.findBySlug(slug.trim());
            if (m.isPresent()) return m.get();
        }
        return null;
    }

    // Helper to parse list of strings
    public List<String> parseStringList(Object value) {
        if (value == null) {
            return new ArrayList<>();
        }
        if (value instanceof List) {
            List<?> rawList = (List<?>) value;
            List<String> result = new ArrayList<>();
            for (Object item : rawList) {
                if (item != null) {
                    result.add(item.toString().trim());
                }
            }
            return result;
        }
        String str = value.toString().trim();
        if (str.isEmpty()) {
            return new ArrayList<>();
        }
        if (str.startsWith("[") && str.endsWith("]")) {
            str = str.substring(1, str.length() - 1);
        }
        String[] parts = str.split(",");
        List<String> result = new ArrayList<>();
        for (String part : parts) {
            String clean = part.trim();
            if (clean.startsWith("'") && clean.endsWith("'")) {
                clean = clean.substring(1, clean.length() - 1);
            } else if (clean.startsWith("\"") && clean.endsWith("\"")) {
                clean = clean.substring(1, clean.length() - 1);
            }
            clean = clean.trim();
            if (!clean.isEmpty()) {
                result.add(clean);
            }
        }
        return result;
    }

    private String cleanUrl(String base, String path) {
        if (base == null) base = "";
        if (path == null) path = "";
        base = base.trim();
        path = path.trim();
        while (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        while (path.startsWith("/")) {
            path = path.substring(1);
        }
        return base + "/" + path;
    }

    // Helper to resolve Poster URL to S3
    public String resolvePosterUrl(MovieImportDto dto) {
        String baseUrl = importProperties.getS3PublicBaseUrl();
        if (baseUrl == null || baseUrl.trim().isEmpty()) {
            baseUrl = "https://chillfilm-assets-07072026.s3.ap-southeast-1.amazonaws.com/posters";
        }
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }

        String originalPoster = dto.getPosterUrl();
        if (originalPoster != null) {
            originalPoster = originalPoster.trim();
            if (originalPoster.startsWith(baseUrl)) {
                return originalPoster;
            }
        }

        if (dto.getPosterFileName() != null && !dto.getPosterFileName().trim().isEmpty()) {
            return cleanUrl(baseUrl, dto.getPosterFileName().trim());
        }

        if (dto.getId() != null) {
            return cleanUrl(baseUrl, dto.getId().toString() + ".jpg");
        }

        String fileName = null;
        if (originalPoster != null && !originalPoster.isEmpty()) {
            int lastSlash = originalPoster.lastIndexOf('/');
            if (lastSlash != -1) {
                fileName = originalPoster.substring(lastSlash + 1).trim();
            } else {
                fileName = originalPoster.trim();
            }
        }

        if (fileName != null && !fileName.isEmpty() && !fileName.contains("?") && 
                (fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".webp") || fileName.endsWith(".jpeg"))) {
            return cleanUrl(baseUrl, fileName);
        }

        if (dto.getSlug() != null && !dto.getSlug().trim().isEmpty()) {
            return cleanUrl(baseUrl, dto.getSlug().trim() + ".jpg");
        }

        return originalPoster;
    }

    // Slug generation
    private String generateSlug(String title, int year) {
        if (title == null || title.trim().isEmpty()) {
            return "movie-" + UUID.randomUUID();
        }
        String normalized = title.toLowerCase()
                .replaceAll("[áàảãạăắằẳẵặâấầẩẫậ]", "a")
                .replaceAll("[éèẻẽẹêếềểễệ]", "e")
                .replaceAll("[íìỉĩị]", "i")
                .replaceAll("[óòỏõọôốồổỗộơớờởỡợ]", "o")
                .replaceAll("[úùủũụưứừửữự]", "u")
                .replaceAll("[ýỳỷỹỵ]", "y")
                .replaceAll("đ", "d")
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
        return normalized + "-" + year;
    }

    // Year parse helper
    private int parseYear(String releaseDateStr, Integer yearField) {
        if (yearField != null && yearField > 0) {
            return yearField;
        }
        if (releaseDateStr != null && !releaseDateStr.trim().isEmpty()) {
            try {
                java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("\\d{4}").matcher(releaseDateStr);
                if (matcher.find()) {
                    return Integer.parseInt(matcher.group());
                }
            } catch (Exception e) {
                // ignore
            }
        }
        return 2026;
    }

    // ReleaseStatus helper
    private ReleaseStatus parseReleaseStatus(String releaseDateStr, String statusStr) {
        if (statusStr != null) {
            try {
                return ReleaseStatus.valueOf(statusStr.toUpperCase());
            } catch (Exception e) {}
        }
        if (releaseDateStr != null && !releaseDateStr.trim().isEmpty()) {
            try {
                java.time.LocalDate releaseDate = null;
                if (releaseDateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
                    releaseDate = java.time.LocalDate.parse(releaseDateStr);
                } else if (releaseDateStr.matches("\\d{4}-\\d{2}-\\d{2} .*")) {
                    releaseDate = java.time.LocalDate.parse(releaseDateStr.substring(0, 10));
                }
                if (releaseDate != null) {
                    if (releaseDate.isAfter(java.time.LocalDate.now())) {
                        return ReleaseStatus.UPCOMING;
                    } else {
                        return ReleaseStatus.COMPLETED;
                    }
                }
            } catch (Exception e) {
                // ignore
            }
        }
        return ReleaseStatus.COMPLETED;
    }

    // LocalDateTime parse helper
    private LocalDateTime parseLocalDateTime(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return LocalDateTime.now();
        }
        try {
            if (dateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
                return java.time.LocalDate.parse(dateStr).atStartOfDay();
            } else if (dateStr.matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}")) {
                return LocalDateTime.parse(dateStr);
            } else if (dateStr.matches("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}")) {
                return LocalDateTime.parse(dateStr.replace(' ', 'T'));
            } else {
                java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\d{4}").matcher(dateStr);
                if (m.find()) {
                    int year = Integer.parseInt(m.group());
                    return LocalDateTime.of(year, 1, 1, 0, 0);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return LocalDateTime.now();
    }

    private ImportResult errorResult(String message) {
        return ImportResult.builder()
                .success(false)
                .message(message)
                .errors(List.of(message))
                .build();
    }

    private ImportResult buildResult(
            boolean success, String message, int total, int created, int updated, int skipped, int failed, List<String> errors) {
        return ImportResult.builder()
                .success(success)
                .message(message)
                .total(total)
                .created(created)
                .updated(updated)
                .skipped(skipped)
                .failed(failed)
                .errors(errors)
                .build();
    }
}
