package com.securevault.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.dto.SecurityAnalyticsResponse;
import com.securevault.backend.service.SecurityAnalyticsService;

@RestController
@RequestMapping("/api/security-analytics")
@CrossOrigin("*")
public class SecurityAnalyticsController {

    private final SecurityAnalyticsService securityAnalyticsService;

    public SecurityAnalyticsController(
            SecurityAnalyticsService securityAnalyticsService) {

        this.securityAnalyticsService =
                securityAnalyticsService;
    }

    // ==========================================
    // GET SECURITY ANALYTICS FOR A USER
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAnalytics(
            @RequestParam String email) {

        try {

            SecurityAnalyticsResponse response =
                    securityAnalyticsService.getAnalytics(email);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put("error", "User not found");
            error.put(
                    "message",
                    "No user exists with the provided email"
            );

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }
    }


    // ==========================================
    // GET SECURITY ANALYTICS FOR ALL USERS
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<?> getAllAnalytics() {

        try {

            SecurityAnalyticsResponse response =
                    securityAnalyticsService.getAllAnalytics();

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "error",
                    "Unable to generate security analytics"
            );

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }
}