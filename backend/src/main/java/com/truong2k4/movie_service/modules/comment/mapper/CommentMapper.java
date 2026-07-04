package com.truong2k4.movie_service.modules.comment.mapper;

import com.truong2k4.movie_service.modules.comment.dto.response.CommentResponse;
import com.truong2k4.movie_service.modules.comment.entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentResponse toResponse(Comment comment) {
        if (comment == null) return null;
        return CommentResponse.builder()
                .id(comment.getId())
                .movieId(comment.getMovieId())
                .parentId(comment.getParentId())
                .userId(comment.getUserId())
                .userName(comment.getUserName())
                .userAvatarUrl(comment.getUserAvatarUrl())
                .content(comment.getContent())
                .status(comment.getStatus())
                .likes(comment.getLikes())
                .reports(comment.getReports())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
