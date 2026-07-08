package com.truong2k4.movie_service.modules.analytics.repository;

import com.truong2k4.movie_service.modules.analytics.entity.DailyTraffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyTrafficRepository extends JpaRepository<DailyTraffic, UUID> {
    Optional<DailyTraffic> findByDate(LocalDate date);
    List<DailyTraffic> findAllByOrderByDateAsc();
}
