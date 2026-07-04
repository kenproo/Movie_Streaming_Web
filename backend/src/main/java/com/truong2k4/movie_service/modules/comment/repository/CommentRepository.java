package com.truong2k4.movie_service.modules.comment.repository;

import com.truong2k4.movie_service.modules.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByMovieIdAndStatusOrderByCreatedAtDesc(UUID movieId, String status);
    List<Comment> findByParentIdOrderByCreatedAtAsc(UUID parentId);
    long countByMovieId(UUID movieId);
    List<Comment> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
