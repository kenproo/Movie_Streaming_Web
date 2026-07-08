package com.truong2k4.movie_service.modules.watch.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.watch.dto.request.UpdateWatchProgressRequest;
import com.truong2k4.movie_service.modules.watch.dto.response.WatchHistoryResponse;
import com.truong2k4.movie_service.modules.watch.dto.response.WatchProgressResponse;
import com.truong2k4.movie_service.modules.watch.service.WatchService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/watch")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WatchController {

    WatchService watchService;

    @PostMapping("/progress")
    public ApiResponse<WatchProgressResponse> updateProgress(
            @RequestBody @Valid UpdateWatchProgressRequest request) {
        return ApiResponse.<WatchProgressResponse>builder()
                .result(watchService.updateProgress(request))
                .build();
    }

    @GetMapping("/history")
    public ApiResponse<List<WatchHistoryResponse>> getHistory() {
        return ApiResponse.<List<WatchHistoryResponse>>builder()
                .result(watchService.getHistory())
                .build();
    }

    @GetMapping("/progress/{episodeId}")
    public ApiResponse<WatchProgressResponse> getProgress(@PathVariable UUID episodeId) {
        return ApiResponse.<WatchProgressResponse>builder()
                .result(watchService.getProgress(episodeId))
                .build();
    }
}
