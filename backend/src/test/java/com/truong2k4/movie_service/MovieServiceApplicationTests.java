package com.truong2k4.movie_service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.truong2k4.movie_service.modules.user.dto.request.AuthenticationRequest;
import com.truong2k4.movie_service.modules.user.dto.request.IntrospectRequest;
import com.truong2k4.movie_service.modules.user.dto.request.LogoutRequest;
import com.truong2k4.movie_service.modules.user.dto.response.AuthenticationResponse;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.entity.UserRole;
import com.truong2k4.movie_service.modules.user.entity.UserStatus;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import com.truong2k4.movie_service.modules.user.service.AuthenticationService;

@SpringBootTest
class MovieServiceApplicationTests {

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Test
    void testAuthenticationFlow() throws Exception {
        String testUsername = "testuser_" + UUID.randomUUID().toString().substring(0, 8);
        String testEmail = testUsername + "@example.com";
        String rawPassword = "password123";

        // 1. Create a test user
        User user = User.builder()
                .name("Test User")
                .email(testEmail)
                .username(testUsername)
                .password(passwordEncoder.encode(rawPassword))
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);
        Assertions.assertNotNull(user.getId());

        try {
            // 2. Test Authenticate (Login)
            AuthenticationRequest authRequest = AuthenticationRequest.builder()
                    .username(testUsername)
                    .password(rawPassword)
                    .build();

            AuthenticationResponse authResponse = authenticationService.authenticate(authRequest);
            Assertions.assertNotNull(authResponse);
            Assertions.assertNotNull(authResponse.getToken());
            Assertions.assertTrue(authResponse.isAuthenticated());

            String token = authResponse.getToken();

            // 3. Test Introspect (Verify Token)
            IntrospectRequest introspectRequest = IntrospectRequest.builder()
                    .token(token)
                    .build();
            var introspectResponse = authenticationService.introspect(introspectRequest);
            Assertions.assertNotNull(introspectResponse);
            Assertions.assertTrue(introspectResponse.isValid());

            // 4. Test Logout (Invalidate Token)
            LogoutRequest logoutRequest = LogoutRequest.builder()
                    .token(token)
                    .build();
            authenticationService.logout(logoutRequest);

            // 5. Test Introspect again after Logout (Should be invalid)
            var introspectResponseAfterLogout = authenticationService.introspect(introspectRequest);
            Assertions.assertNotNull(introspectResponseAfterLogout);
            Assertions.assertFalse(introspectResponseAfterLogout.isValid());

        } finally {
            // Cleanup database
            userRepository.delete(user);
        }
    }
}
