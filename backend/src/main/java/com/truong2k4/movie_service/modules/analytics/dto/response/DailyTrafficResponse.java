package com.truong2k4.movie_service.modules.analytics.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DailyTrafficResponse {
    UUID id;
    LocalDate date;
    int visits;
    int views;
}
