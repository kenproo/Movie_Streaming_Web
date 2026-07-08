package com.truong2k4.movie_service.modules.report.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.report.dto.request.FilmReportCreateRequest;
import com.truong2k4.movie_service.modules.report.dto.response.FilmReportResponse;
import com.truong2k4.movie_service.modules.report.entity.FilmReport;
import com.truong2k4.movie_service.modules.report.entity.FilmReportStatus;
import com.truong2k4.movie_service.modules.report.mapper.FilmReportMapper;
import com.truong2k4.movie_service.modules.report.service.FilmReportService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FilmReportController {

    FilmReportService filmReportService;
    FilmReportMapper filmReportMapper;

    @PostMapping("/reports")
    public ApiResponse<FilmReportResponse> createReport(@RequestBody @Valid FilmReportCreateRequest request) {
        FilmReport report = filmReportService.createReport(request.getMovieId(), request.getReason(), request.getDetail());
        return ApiResponse.<FilmReportResponse>builder()
                .result(filmReportMapper.toResponse(report))
                .build();
    }

    @GetMapping("/admin/reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<FilmReportResponse>> getReports(@RequestParam(required = false) FilmReportStatus status) {
        var reports = filmReportService.getReports(status);
        var result = reports.stream()
                .map(filmReportMapper::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<FilmReportResponse>>builder()
                .result(result)
                .build();
    }

    @PatchMapping("/admin/reports/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<FilmReportResponse> updateReportStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        FilmReportStatus status = FilmReportStatus.valueOf(body.get("status").toUpperCase());
        FilmReport report = filmReportService.updateReportStatus(id, status);
        return ApiResponse.<FilmReportResponse>builder()
                .result(filmReportMapper.toResponse(report))
                .build();
    }

    @GetMapping("/admin/reports/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.<Long>builder()
                .result(filmReportService.getUnreadCount())
                .build();
    }
}
