package com.truong2k4.movie_service.modules.search.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "search_histories", indexes = {
        @Index(name = "idx_search_user_id", columnList = "user_id"),
        @Index(name = "idx_search_keyword", columnList = "keyword")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    UUID userId;

    @Column(nullable = false)
    String keyword;

    Integer resultCount;

    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
