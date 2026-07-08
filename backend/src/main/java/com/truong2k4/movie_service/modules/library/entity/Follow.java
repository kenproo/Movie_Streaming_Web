package com.truong2k4.movie_service.modules.library.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_follows", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "movie_id"})
}, indexes = {
        @Index(name = "idx_follow_user_id", columnList = "user_id"),
        @Index(name = "idx_follow_movie_id", columnList = "movie_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @Column(name = "movie_id", nullable = false)
    UUID movieId;

    LocalDateTime createdAt;
}
