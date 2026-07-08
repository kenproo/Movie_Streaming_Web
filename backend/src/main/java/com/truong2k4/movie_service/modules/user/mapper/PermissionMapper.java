package com.truong2k4.movie_service.modules.user.mapper;

import org.springframework.stereotype.Component;

import com.truong2k4.movie_service.modules.user.dto.request.PermissionRequest;
import com.truong2k4.movie_service.modules.user.dto.response.PermissionResponse;
import com.truong2k4.movie_service.modules.user.entity.Permission;

@Component
public class PermissionMapper {

    public Permission toPermission(PermissionRequest request) {
        if (request == null) {
            return null;
        }
        return Permission.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public PermissionResponse toPermissionResponse(Permission permission) {
        if (permission == null) {
            return null;
        }
        return PermissionResponse.builder()
                .name(permission.getName())
                .description(permission.getDescription())
                .build();
    }
}
