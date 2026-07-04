package com.truong2k4.movie_service.modules.movie.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "movies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(unique = true, nullable = false)
    String slug;

    @Column(nullable = false)
    String title;

    String originalTitle;

    @Column(columnDefinition = "TEXT")
    String description;

    int year;

    String country;

    @Enumerated(EnumType.STRING)
    MovieType type;

    String quality;

    String language;

    double rating;

    String duration;

    int totalEpisodes;

    int currentEpisode;

    @Enumerated(EnumType.STRING)
    ReleaseStatus releaseStatus;

    @Enumerated(EnumType.STRING)
    MovieStatus status;

    long views;

    @Column(length = 1000)
    String posterUrl;

    @Column(length = 1000)
    String backdropUrl;

    @Column(length = 1000)
    String trailerUrl;

    @Enumerated(EnumType.STRING)
    AnimeSeason animeSeason;

    @Column(name = "tmdb_id", unique = true)
    String tmdbId;

    @Column(name = "imdb_id", unique = true)
    String imdbId;

    String director;

    String writer;

    String studio;

    String ageRating;

    Double popularity;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_keywords", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "keyword")
    @Builder.Default
    List<String> keywords = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_tags", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "tag")
    @Builder.Default
    List<String> tags = new ArrayList<>();

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genre")
    @Builder.Default
    List<String> genres = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_cast", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "cast_member")
    @Builder.Default
    List<String> cast = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "movie", fetch = FetchType.LAZY)
    @Builder.Default
    List<Episode> episodes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
