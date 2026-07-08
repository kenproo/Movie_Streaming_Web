package com.truong2k4.movie_service.modules.user.mapper;

import com.truong2k4.movie_service.modules.user.dto.response.UserResponse;
import com.truong2k4.movie_service.modules.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId() != null ? user.getId().toString() : null)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name().toLowerCase() : null)
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus() != null ? user.getStatus().name().toLowerCase() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
