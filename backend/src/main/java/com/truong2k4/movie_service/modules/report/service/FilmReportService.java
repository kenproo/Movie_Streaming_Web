package com.truong2k4.movie_service.modules.report.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.movie.entity.Movie;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import com.truong2k4.movie_service.modules.report.entity.FilmReport;
import com.truong2k4.movie_service.modules.report.entity.FilmReportStatus;
import com.truong2k4.movie_service.modules.report.repository.FilmReportRepository;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FilmReportService {

    FilmReportRepository filmReportRepository;
    MovieRepository movieRepository;
    UserRepository userRepository;

    @Transactional
    public FilmReport createReport(UUID movieId, String reason, String detail) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        User currentUser = getCurrentUser();

        FilmReport report = FilmReport.builder()
                .movieId(movieId)
                .movieTitle(movie.getTitle())
                .reporterName(currentUser.getName())
                .reason(reason)
                .detail(detail)
                .status(FilmReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return filmReportRepository.save(report);
    }

    public List<FilmReport> getReports(FilmReportStatus status) {
        if (status == null) {
            return filmReportRepository.findAllByOrderByCreatedAtDesc();
        }
        return filmReportRepository.findAllByStatusOrderByCreatedAtDesc(status);
    }

    @Transactional
    public FilmReport updateReportStatus(UUID reportId, FilmReportStatus status) {
        FilmReport report = filmReportRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_FOUND));
        report.setStatus(status);
        report.setUpdatedAt(LocalDateTime.now());
        return filmReportRepository.save(report);
    }

    public long getUnreadCount() {
        return filmReportRepository.countByStatus(FilmReportStatus.PENDING);
    }

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName(); // username/email
        return userRepository.findByUsername(name)
                .or(() -> userRepository.findByEmail(name))
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }
}
