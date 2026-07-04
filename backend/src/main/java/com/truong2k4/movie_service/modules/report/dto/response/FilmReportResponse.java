package com.truong2k4.movie_service.modules.report.dto.response;

import com.truong2k4.movie_service.modules.report.entity.FilmReportStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FilmReportResponse {
    UUID id;
    UUID movieId;
    String movieTitle;
    String reporterName;
    String reason;
    String detail;
    FilmReportStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
