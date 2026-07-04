package com.truong2k4.movie_service.modules.media.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.media.dto.request.MediaUploadRequest;
import com.truong2k4.movie_service.modules.media.dto.response.MediaResponse;
import com.truong2k4.movie_service.modules.media.service.MediaService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaController {

    MediaService mediaService;

    @PostMapping("/upload")
    public ApiResponse<MediaResponse> upload(@RequestBody @Valid MediaUploadRequest request) {
        return ApiResponse.<MediaResponse>builder()
                .result(mediaService.processUpload(request))
                .build();
    }

    @GetMapping("/{id}/url")
    public ApiResponse<String> getUrl(@PathVariable String id) {
        return ApiResponse.<String>builder()
                .result(mediaService.getMediaUrl(id))
                .build();
    }
}
