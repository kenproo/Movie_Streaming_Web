package com.truong2k4.movie_service.modules.user.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.user.dto.request.LoginRequest;
import com.truong2k4.movie_service.modules.user.dto.request.RegisterRequest;
import com.truong2k4.movie_service.modules.user.dto.response.LoginResponse;
import com.truong2k4.movie_service.modules.user.dto.response.UserResponse;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.entity.UserRole;
import com.truong2k4.movie_service.modules.user.entity.UserStatus;
import com.truong2k4.movie_service.modules.user.mapper.UserMapper;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class UserService {

    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final UserMapper userMapper;

    @Value("${jwt.signerKey}")
    String signerKey;

    @Value("${jwt.valid-duration}")
    long validDuration;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (user.getStatus() == UserStatus.LOCKED) {
            throw new AppException(ErrorCode.USER_LOCKED);
        }

        String token = generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    public UserResponse register(RegisterRequest request) {
        String username = request.getEmail().split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 5);
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .avatarUrl("https://placehold.co/120x120/082f49/67e8f9?text=" + request.getName().trim().substring(0, 1).toUpperCase())
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    public UserResponse getProfile() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName(); // username
        User user = userRepository.findByUsername(name)
                .or(() -> userRepository.findByEmail(name))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return mapToUserResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUserRole(UUID userId, String roleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setRole(UserRole.valueOf(roleStr.toUpperCase()));
        return mapToUserResponse(userRepository.save(user));
    }

    public UserResponse lockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setStatus(UserStatus.LOCKED);
        return mapToUserResponse(userRepository.save(user));
    }

    public UserResponse unlockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setStatus(UserStatus.ACTIVE);
        return mapToUserResponse(userRepository.save(user));
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("chillfilm.com")
                .issueTime(new Date())
                .expirationTime(new Date(System.currentTimeMillis() + validDuration * 1000))
                .claim("userId", user.getId().toString())
                .claim("role", user.getRole().name())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot sign jwt token", e);
            throw new RuntimeException("Cannot sign token", e);
        }
    }

    public UserResponse mapToUserResponse(User user) {
        return userMapper.toUserResponse(user);
    }
}
