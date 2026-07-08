package com.truong2k4.movie_service.modules.comment.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    UUID id;
    UUID movieId;
    UUID parentId;
    UUID userId;
    String userName;
    String userAvatarUrl;
    String content;
    String status;
    int likes;
    int reports;
    LocalDateTime createdAt;
}
