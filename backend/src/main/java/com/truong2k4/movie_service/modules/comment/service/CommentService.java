package com.truong2k4.movie_service.modules.comment.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.comment.dto.request.CommentCreateRequest;
import com.truong2k4.movie_service.modules.comment.dto.request.CommentUpdateRequest;
import com.truong2k4.movie_service.modules.comment.dto.response.CommentResponse;
import com.truong2k4.movie_service.modules.comment.entity.Comment;
import com.truong2k4.movie_service.modules.comment.mapper.CommentMapper;
import com.truong2k4.movie_service.modules.comment.repository.CommentRepository;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {

    CommentRepository commentRepository;
    UserRepository userRepository;
    CommentMapper commentMapper;

    public List<CommentResponse> getMovieComments(UUID movieId) {
        return commentRepository.findByMovieIdAndStatusOrderByCreatedAtDesc(movieId, "visible")
                .stream().map(commentMapper::toResponse).collect(Collectors.toList());
    }

    public List<CommentResponse> getReplies(UUID parentId) {
        return commentRepository.findByParentIdOrderByCreatedAtAsc(parentId)
                .stream().map(commentMapper::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(CommentCreateRequest request) {
        User user = getCurrentUser();
        Comment comment = Comment.builder()
                .movieId(request.getMovieId())
                .parentId(request.getParentId())
                .userId(user.getId())
                .userName(user.getName())
                .userAvatarUrl(user.getAvatarUrl())
                .content(request.getContent())
                .status("visible")
                .build();
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse updateComment(UUID commentId, CommentUpdateRequest request) {
        User user = getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        if (!comment.getUserId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        comment.setContent(request.getContent());
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(UUID commentId) {
        User user = getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !comment.getUserId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        commentRepository.delete(comment);
    }

    @Transactional
    public CommentResponse likeComment(UUID commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        comment.setLikes(comment.getLikes() + 1);
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse reportComment(UUID commentId, String reason) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        comment.setReports(comment.getReports() + 1);
        comment.setReportReason(reason);
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    private User getCurrentUser() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(name)
                .or(() -> userRepository.findByEmail(name))
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }
}
