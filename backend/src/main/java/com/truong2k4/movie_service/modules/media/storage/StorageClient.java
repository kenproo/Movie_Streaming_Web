package com.truong2k4.movie_service.modules.media.storage;

import java.io.InputStream;

/**
 * Interface for file storage (S3, MinIO, local, etc.).
 * TODO: Implement with actual S3/MinIO client when ready.
 */
public interface StorageClient {

    /**
     * Upload a file and return its public URL.
     *
     * @param key         storage key (e.g. "posters/movie-id.jpg")
     * @param inputStream file content
     * @param contentType MIME type
     * @return public URL of the uploaded file
     */
    String upload(String key, InputStream inputStream, String contentType);

    /**
     * Delete a file by key.
     *
     * @param key storage key
     */
    void delete(String key);

    /**
     * Get public URL for a key.
     */
    String getUrl(String key);
}
