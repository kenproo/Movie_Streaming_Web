package com.truong2k4.movie_service.modules.comment.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.comment.dto.request.CommentCreateRequest;
import com.truong2k4.movie_service.modules.comment.dto.request.CommentUpdateRequest;
import com.truong2k4.movie_service.modules.comment.dto.response.CommentResponse;
import com.truong2k4.movie_service.modules.comment.service.CommentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {

    CommentService commentService;

    @GetMapping("/comments/movie/{movieId}")
    public ApiResponse<List<CommentResponse>> getMovieComments(@PathVariable UUID movieId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getMovieComments(movieId))
                .build();
    }

    @GetMapping("/comments/replies/{parentId}")
    public ApiResponse<List<CommentResponse>> getReplies(@PathVariable UUID parentId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getReplies(parentId))
                .build();
    }

    @PostMapping("/comments")
    public ApiResponse<CommentResponse> createComment(@RequestBody @Valid CommentCreateRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(request))
                .build();
    }

    @PutMapping("/comments/{id}")
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable UUID id,
            @RequestBody @Valid CommentUpdateRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.updateComment(id, request))
                .build();
    }

    @DeleteMapping("/comments/{id}")
    public ApiResponse<String> deleteComment(@PathVariable UUID id) {
        commentService.deleteComment(id);
        return ApiResponse.<String>builder().result("Comment deleted").build();
    }

    @PostMapping("/comments/{id}/like")
    public ApiResponse<CommentResponse> likeComment(@PathVariable UUID id) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.likeComment(id))
                .build();
    }

    @PostMapping("/comments/{id}/report")
    public ApiResponse<CommentResponse> reportComment(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.reportComment(id, body.get("reason")))
                .build();
    }
}
