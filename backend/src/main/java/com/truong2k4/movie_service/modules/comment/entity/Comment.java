package com.truong2k4.movie_service.modules.comment.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    UUID movieId;

    UUID parentId;

    @Column(nullable = false)
    UUID userId;

    @Column(nullable = false)
    String userName;

    String userAvatarUrl;

    @Column(columnDefinition = "TEXT", nullable = false)
    String content;

    @Builder.Default
    String status = "visible";

    @Builder.Default
    int likes = 0;

    @Builder.Default
    int reports = 0;

    String reportReason;

    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
