package com.truong2k4.movie_service.modules.analytics.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "analytics_access_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    UUID userId;

    UUID movieId;

    String page;

    String action; // visit, watch, search, comment, like

    String keyword;

    LocalDateTime createdAt;
}
