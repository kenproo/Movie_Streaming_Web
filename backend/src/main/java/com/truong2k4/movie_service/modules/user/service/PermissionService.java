package com.truong2k4.movie_service.modules.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.truong2k4.movie_service.modules.user.dto.request.PermissionRequest;
import com.truong2k4.movie_service.modules.user.dto.response.PermissionResponse;
import com.truong2k4.movie_service.modules.user.entity.Permission;
import com.truong2k4.movie_service.modules.user.mapper.PermissionMapper;
import com.truong2k4.movie_service.modules.user.repository.PermissionRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        permission = permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAll() {
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void delete(String permission) {
        permissionRepository.deleteById(permission);
    }
}
