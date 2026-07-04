package com.truong2k4.movie_service.modules.library.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_watch_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "movie_id", "episode_id"})
}, indexes = {
        @Index(name = "idx_watch_progress_user_id", columnList = "user_id"),
        @Index(name = "idx_watch_progress_movie_id", columnList = "movie_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WatchProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @Column(name = "movie_id", nullable = false)
    UUID movieId;

    @Column(name = "episode_id", nullable = false)
    UUID episodeId;

    Integer episodeNumber;

    @Builder.Default
    Integer currentTimeSeconds = 0;

    @Builder.Default
    Integer durationSeconds = 0;

    @Builder.Default
    Boolean completed = false;

    LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
