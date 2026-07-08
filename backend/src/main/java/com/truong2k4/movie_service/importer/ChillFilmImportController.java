package com.truong2k4.movie_service.importer;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/import")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class ChillFilmImportController {

    ChillFilmDataImportService importService;

    @PostMapping("/dry-run")
    public ImportResult dryRun() {
        return importService.dryRun();
    }

    @PostMapping("/all")
    public ImportResult importAll() {
        return importService.importAll();
    }

    @PostMapping("/movies")
    public ImportResult importMovies() {
        return importService.importMovies();
    }

    @PostMapping("/episodes")
    public ImportResult importEpisodes() {
        return importService.importEpisodes();
    }

    @PostMapping("/episode-sources")
    public ImportResult importEpisodeSources() {
        return importService.importEpisodeSources();
    }

    @PostMapping("/subtitles")
    public ImportResult importSubtitles() {
        return importService.importSubtitles();
    }

    @PostMapping("/movie-video-sources")
    public ImportResult importMovieVideoSources() {
        return importService.importMovieVideoSources();
    }
}
