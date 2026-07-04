package com.truong2k4.movie_service.modules.rag.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rag_chat_messages", indexes = {
        @Index(name = "idx_rag_chat_user_id", columnList = "user_id"),
        @Index(name = "idx_rag_chat_session_id", columnList = "session_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RagChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "session_id")
    UUID sessionId;

    @Column(name = "user_id")
    UUID userId;

    @Column(columnDefinition = "TEXT", nullable = false)
    String userMessage;

    @Column(columnDefinition = "TEXT")
    String assistantMessage;

    @Column(columnDefinition = "TEXT")
    String retrievedMovieIds;

    @Column(columnDefinition = "TEXT")
    String retrievedContext;

    String modelName;

    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
