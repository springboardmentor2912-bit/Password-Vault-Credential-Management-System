package com.securevault.controller;

import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import com.securevault.service.SecurityAnalyticsService;
import com.securevault.service.SecurityAnalyticsService.SecurityAnalyticsData;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/security-analytics")
@RequiredArgsConstructor
public class SecurityAnalyticsController {

    private final SecurityAnalyticsService securityAnalyticsService;
    private final UserRepository userRepository;

    @GetMapping
    public SecurityAnalyticsData getSecurityAnalytics() {

        // Get the email of the currently authenticated user
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        // Find that user in the database
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        // Get real security analytics from PostgreSQL
        return securityAnalyticsService.getAnalytics(user);
    }
}