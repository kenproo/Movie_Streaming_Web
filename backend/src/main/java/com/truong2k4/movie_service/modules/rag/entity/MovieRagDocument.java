package com.truong2k4.movie_service.modules.rag.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "movie_rag_documents", indexes = {
        @Index(name = "idx_rag_movie_id", columnList = "movie_id"),
        @Index(name = "idx_rag_source_type", columnList = "source_type"),
        @Index(name = "idx_rag_embedded", columnList = "embedded")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieRagDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "movie_id", nullable = false)
    UUID movieId;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    RagSourceType sourceType;

    @Column(columnDefinition = "TEXT", nullable = false)
    String content;

    @Column(name = "content_hash", length = 64)
    String contentHash;

    @Column(name = "qdrant_collection")
    String qdrantCollection;

    @Column(name = "qdrant_point_id")
    String qdrantPointId;

    @Column(name = "embedding_model")
    String embeddingModel;

    @Builder.Default
    Boolean embedded = false;

    LocalDateTime embeddedAt;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

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
