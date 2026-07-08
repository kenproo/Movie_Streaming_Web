package com.truong2k4.movie_service.modules.media.service;

import com.truong2k4.movie_service.modules.media.dto.request.MediaUploadRequest;
import com.truong2k4.movie_service.modules.media.dto.response.MediaResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Media management service.
 * TODO: Integrate with StorageClient (S3/MinIO) for real file uploads.
 */
@Service
@Slf4j
public class MediaService {

    public MediaResponse processUpload(MediaUploadRequest request) {
        // TODO: Implement real upload logic with StorageClient
        log.info("[MediaService] Processing upload: {} ({})", request.getFileName(), request.getMediaType());

        // Return a demo response with a placeholder URL
        String demoId = UUID.randomUUID().toString();
        String demoUrl = "/media/" + request.getMediaType().toLowerCase() + "/" + demoId + "/" + request.getFileName();

        return MediaResponse.builder()
                .id(demoId)
                .fileName(request.getFileName())
                .mediaType(request.getMediaType())
                .url(demoUrl)
                .contentType(request.getContentType())
                .fileSize(request.getFileSize())
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    public String getMediaUrl(String mediaId) {
        // TODO: Lookup actual URL from storage or database
        return "/media/" + mediaId;
    }
}
