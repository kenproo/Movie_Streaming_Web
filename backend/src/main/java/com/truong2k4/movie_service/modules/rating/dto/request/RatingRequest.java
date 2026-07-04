package com.truong2k4.movie_service.modules.rating.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RatingRequest {
    @NotNull
    UUID movieId;

    @NotNull
    @Min(1) @Max(10)
    Integer score;

    String review;
}
