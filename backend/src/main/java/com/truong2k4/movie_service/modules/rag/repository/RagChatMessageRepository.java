package com.truong2k4.movie_service.modules.rag.repository;

import com.truong2k4.movie_service.modules.rag.entity.RagChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RagChatMessageRepository extends JpaRepository<RagChatMessage, UUID> {

    List<RagChatMessage> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<RagChatMessage> findBySessionIdOrderByCreatedAtAsc(UUID sessionId);
}
