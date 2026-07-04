package com.truong2k4.movie_service.modules.search.repository;

import com.truong2k4.movie_service.modules.search.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, UUID> {

    List<SearchHistory> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
