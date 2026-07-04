package com.truong2k4.movie_service.modules.watch.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateWatchProgressRequest {
    @NotNull
    UUID movieId;
    @NotNull
    UUID episodeId;
    int episodeNumber;
    @NotNull
    Integer progressSeconds;
    Integer durationSeconds;
}
