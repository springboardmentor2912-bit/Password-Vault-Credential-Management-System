package com.securevault.controller;

import com.securevault.entity.LoginActivity;
import com.securevault.entity.User;
import com.securevault.repository.LoginActivityRepository;
import com.securevault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
public class LoginActivityController {

    private final LoginActivityRepository loginActivityRepository;
    private final UserRepository userRepository;

    @GetMapping("/login-activities")
    public ResponseEntity<List<LoginActivity>> getLoginActivities(
            Authentication authentication
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return ResponseEntity.ok(
                loginActivityRepository
                        .findByUserOrderByLoginTimeDesc(user)
        );
    }
}