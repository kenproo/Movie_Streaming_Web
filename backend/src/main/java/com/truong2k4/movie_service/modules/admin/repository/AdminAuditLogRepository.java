package com.truong2k4.movie_service.modules.admin.repository;

import com.truong2k4.movie_service.modules.admin.entity.AdminAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, UUID> {

    List<AdminAuditLog> findByAdminIdOrderByCreatedAtDesc(UUID adminId);

    List<AdminAuditLog> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, UUID targetId);
}
