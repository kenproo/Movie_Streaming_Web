package com.truong2k4.movie_service.modules.report.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "film_reports")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FilmReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    UUID movieId;

    @Column(nullable = false)
    String movieTitle;

    @Column(nullable = false)
    String reporterName;

    @Column(nullable = false)
    String reason;

    @Column(columnDefinition = "TEXT")
    String detail;

    @Enumerated(EnumType.STRING)
    FilmReportStatus status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
