package com.truong2k4.movie_service.modules.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    @NotBlank(message = "INVALID_INPUT")
    @Email(message = "INVALID_INPUT")
    String email;

    @NotBlank(message = "INVALID_INPUT")
    String password;
}
