package com.truong2k4.movie_service.modules.library.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.library.dto.LibraryResponse;
import com.truong2k4.movie_service.modules.library.dto.request.AddHistoryRequest;
import com.truong2k4.movie_service.modules.library.service.LibraryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/library")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibraryController {

    LibraryService libraryService;

    @GetMapping
    public ApiResponse<LibraryResponse> getLibrary() {
        return ApiResponse.<LibraryResponse>builder()
                .result(libraryService.getLibrary())
                .build();
    }

    @GetMapping("/favorite/{movieId}")
    public ApiResponse<Boolean> isFavorite(@PathVariable UUID movieId) {
        return ApiResponse.<Boolean>builder()
                .result(libraryService.isFavorite(movieId))
                .build();
    }

    @PostMapping("/favorite/{movieId}")
    public ApiResponse<String> toggleFavorite(@PathVariable UUID movieId) {
        libraryService.toggleFavorite(movieId);
        return ApiResponse.<String>builder().result("Success").build();
    }

    @GetMapping("/follow/{movieId}")
    public ApiResponse<Boolean> isFollowing(@PathVariable UUID movieId) {
        return ApiResponse.<Boolean>builder()
                .result(libraryService.isFollowing(movieId))
                .build();
    }

    @PostMapping("/follow/{movieId}")
    public ApiResponse<String> toggleFollow(@PathVariable UUID movieId) {
        libraryService.toggleFollow(movieId);
        return ApiResponse.<String>builder().result("Success").build();
    }

    @PostMapping("/history")
    public ApiResponse<String> addHistory(@RequestBody @Valid AddHistoryRequest request) {
        libraryService.addHistory(request.getMovieId(), request.getEpisodeNumber());
        return ApiResponse.<String>builder().result("History recorded").build();
    }
}
