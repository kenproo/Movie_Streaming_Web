package com.truong2k4.movie_service.modules.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_audit_logs", indexes = {
        @Index(name = "idx_admin_audit_admin_id", columnList = "admin_id"),
        @Index(name = "idx_admin_audit_target", columnList = "targetType,targetId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "admin_id", nullable = false)
    UUID adminId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AdminActionType action;

    String targetType;

    UUID targetId;

    @Column(columnDefinition = "TEXT")
    String oldValue;

    @Column(columnDefinition = "TEXT")
    String newValue;

    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
