package com.truong2k4.movie_service.modules.movie.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Entity
@Table(name = "movie_video_sources")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieVideoSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    Movie movie;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    VideoType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    VideoProvider provider;

    @Column(columnDefinition = "TEXT")
    String videoUrl;

    String embedUrl;

    @Column(length = 500)
    String storageKey;

    @Column(length = 20)
    String quality;

    Integer durationSeconds;

    @Column(length = 50)
    String licenseType;

    @Column(columnDefinition = "TEXT")
    String attribution;

    @Builder.Default
    Boolean isDemo = false;

    @Builder.Default
    Boolean isActive = true;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isDemo == null) {
            isDemo = false;
        }
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
