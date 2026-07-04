package com.truong2k4.movie_service.modules.movie.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
}
