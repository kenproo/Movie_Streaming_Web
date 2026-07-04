package com.truong2k4.movie_service.modules.library.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_watch_history", indexes = {
        @Index(name = "idx_watch_history_user_id", columnList = "user_id"),
        @Index(name = "idx_watch_history_movie_id", columnList = "movie_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @Column(name = "movie_id", nullable = false)
    UUID movieId;

    int episodeNumber;

    LocalDateTime watchedAt;
}
