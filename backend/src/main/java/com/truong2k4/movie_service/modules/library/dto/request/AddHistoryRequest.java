package com.truong2k4.movie_service.modules.library.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddHistoryRequest {
    @NotNull
    UUID movieId;
    int episodeNumber;
}
