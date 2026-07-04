package com.truong2k4.movie_service.modules.movie.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "episodes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Episode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    int episodeNumber;

    String title;

    @Column(length = 1000)
    String videoUrl;

    @Column(columnDefinition = "TEXT")
    String summary;

    String duration;

    @Column(length = 1000)
    String thumbnailUrl;

    LocalDateTime releasedAt;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    @JsonIgnore
    Movie movie;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "episode", fetch = FetchType.LAZY)
    @Builder.Default
    List<EpisodeSource> sources = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "episode", fetch = FetchType.LAZY)
    @Builder.Default
    List<Subtitle> subtitles = new ArrayList<>();
}
