package com.truong2k4.movie_service.modules.user.controller;

import com.truong2k4.movie_service.common.dto.ApiResponse;
import com.truong2k4.movie_service.modules.user.dto.response.UserResponse;
import com.truong2k4.movie_service.modules.user.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    UserService userService;

    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUsers())
                .build();
    }

    @PatchMapping("/{id}/role")
    public ApiResponse<UserResponse> updateUserRole(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUserRole(id, role))
                .build();
    }

    @PatchMapping("/{id}/lock")
    public ApiResponse<UserResponse> lockUser(@PathVariable UUID id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.lockUser(id))
                .build();
    }

    @PatchMapping("/{id}/unlock")
    public ApiResponse<UserResponse> unlockUser(@PathVariable UUID id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.unlockUser(id))
                .build();
    }
}
