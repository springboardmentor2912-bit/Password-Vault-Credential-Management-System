package com.securevault.controller;

import com.securevault.entity.SuspiciousActivity;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import com.securevault.service.SuspiciousActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
@CrossOrigin
public class SuspiciousActivityController {

    private final SuspiciousActivityService suspiciousActivityService;
    private final UserRepository userRepository;

    @GetMapping("/suspicious-activities")
    public ResponseEntity<List<SuspiciousActivity>> getSuspiciousActivities(
            Authentication authentication
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return ResponseEntity.ok(
                suspiciousActivityService
                        .getUserSuspiciousActivities(user)
        );
    }
}