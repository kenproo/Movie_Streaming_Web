package com.truong2k4.movie_service.modules.movie.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "episode_sources", indexes = {
        @Index(name = "idx_episode_source_episode_id", columnList = "episode_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeSource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "episode_id", nullable = false)
    @JsonIgnore
    Episode episode;

    @Column(nullable = false)
    String serverName;

    @Column(nullable = false)
    String quality;

    @Column(length = 1000, nullable = false)
    String videoUrl;

    @Column(length = 1000)
    String subtitleUrl;

    @Builder.Default
    Boolean isDefault = false;

    @Enumerated(EnumType.STRING)
    VideoProvider provider;

    String embedUrl;

    String storageKey;

    @Builder.Default
    Boolean isActive = true;

    @Builder.Default
    Boolean isDemo = false;

    String licenseType;

    @Column(columnDefinition = "TEXT")
    String attribution;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isDefault == null) isDefault = false;
        if (isActive == null) isActive = true;
        if (isDemo == null) isDemo = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
