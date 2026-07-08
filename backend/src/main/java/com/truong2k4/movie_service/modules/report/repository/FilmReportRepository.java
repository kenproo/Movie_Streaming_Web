package com.truong2k4.movie_service.modules.report.repository;

import com.truong2k4.movie_service.modules.report.entity.FilmReport;
import com.truong2k4.movie_service.modules.report.entity.FilmReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FilmReportRepository extends JpaRepository<FilmReport, UUID> {
    List<FilmReport> findAllByOrderByCreatedAtDesc();
    List<FilmReport> findAllByStatusOrderByCreatedAtDesc(FilmReportStatus status);
    long countByStatus(FilmReportStatus status);
}
