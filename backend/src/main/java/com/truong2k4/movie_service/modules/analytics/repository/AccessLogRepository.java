package com.truong2k4.movie_service.modules.analytics.repository;

import com.truong2k4.movie_service.modules.analytics.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, UUID> {
    List<AccessLog> findAllByOrderByCreatedAtDesc();
}
