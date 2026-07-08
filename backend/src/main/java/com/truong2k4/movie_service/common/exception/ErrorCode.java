package com.truong2k4.movie_service.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already exists", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User does not exist", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    
    // Movie & Streaming errors
    MOVIE_NOT_FOUND(2001, "Movie not found", HttpStatus.NOT_FOUND),
    EPISODE_NOT_FOUND(2002, "Episode not found", HttpStatus.NOT_FOUND),
    COMMENT_NOT_FOUND(3001, "Comment not found", HttpStatus.NOT_FOUND),
    REPORT_NOT_FOUND(4001, "Report not found", HttpStatus.NOT_FOUND),
    USER_LOCKED(5001, "User account is locked", HttpStatus.FORBIDDEN),
    INVALID_INPUT(6001, "Invalid input data", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND(7001, "Notification not found", HttpStatus.NOT_FOUND),
    MEDIA_UPLOAD_FAILED(8001, "Media upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
    VIDEO_SOURCE_NOT_FOUND(2003, "Video source not found", HttpStatus.NOT_FOUND),
    PEXELS_API_ERROR(8002, "Pexels API error", HttpStatus.BAD_GATEWAY),
    PEXELS_API_UNCONFIGURED(8003, "Pexels API is not configured or disabled", HttpStatus.SERVICE_UNAVAILABLE)
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
