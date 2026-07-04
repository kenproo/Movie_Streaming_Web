package com.truong2k4.movie_service.modules.report.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FilmReportCreateRequest {
    @NotNull(message = "Movie ID is required")
    UUID movieId;

    @NotBlank(message = "Reason is required")
    String reason;

    String detail;
}
