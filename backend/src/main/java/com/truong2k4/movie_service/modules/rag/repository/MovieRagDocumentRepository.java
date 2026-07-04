package com.truong2k4.movie_service.modules.rag.repository;

import com.truong2k4.movie_service.modules.rag.entity.MovieRagDocument;
import com.truong2k4.movie_service.modules.rag.entity.RagSourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MovieRagDocumentRepository extends JpaRepository<MovieRagDocument, UUID> {

    List<MovieRagDocument> findByEmbeddedFalse();

    List<MovieRagDocument> findByMovieId(UUID movieId);

    List<MovieRagDocument> findByMovieIdAndSourceType(UUID movieId, RagSourceType sourceType);
}
