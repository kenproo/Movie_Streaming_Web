package com.truong2k4.movie_service.modules.comment.dto.request;

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
public class CommentCreateRequest {
    @NotNull(message = "Movie ID is required")
    UUID movieId;

    UUID parentId;

    @NotBlank(message = "Content is required")
    String content;
}
