package com.truong2k4.movie_service.modules.notification.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.notification.dto.request.BroadcastNotificationRequest;
import com.truong2k4.movie_service.modules.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class AdminNotificationController {

    NotificationService notificationService;

    @PostMapping("/broadcast")
    public ApiResponse<String> broadcastNotification(@RequestBody @Valid BroadcastNotificationRequest request) {
        notificationService.broadcastNotification(request.getTitle(), request.getContent(), request.getTargetUrl());
        return ApiResponse.<String>builder()
                .result("Broadcast notification sent successfully")
                .build();
    }
}
