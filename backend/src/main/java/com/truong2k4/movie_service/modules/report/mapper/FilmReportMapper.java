package com.truong2k4.movie_service.modules.report.mapper;

import com.truong2k4.movie_service.modules.report.dto.response.FilmReportResponse;
import com.truong2k4.movie_service.modules.report.entity.FilmReport;
import org.springframework.stereotype.Component;

@Component
public class FilmReportMapper {

    public FilmReportResponse toResponse(FilmReport report) {
        if (report == null) return null;
        return FilmReportResponse.builder()
                .id(report.getId())
                .movieId(report.getMovieId())
                .movieTitle(report.getMovieTitle())
                .reporterName(report.getReporterName())
                .reason(report.getReason())
                .detail(report.getDetail())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}
