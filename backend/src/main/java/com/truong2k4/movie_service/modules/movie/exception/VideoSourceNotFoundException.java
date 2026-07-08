package com.truong2k4.movie_service.modules.movie.exception;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;

public class VideoSourceNotFoundException extends AppException {
    public VideoSourceNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
}
