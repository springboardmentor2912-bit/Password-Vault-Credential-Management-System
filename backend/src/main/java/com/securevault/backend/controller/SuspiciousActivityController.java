package com.securevault.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.service.SuspiciousActivityService;

@RestController
@RequestMapping("/api/suspicious-activities")
@CrossOrigin("*")
public class SuspiciousActivityController {

    private final SuspiciousActivityService suspiciousActivityService;

    public SuspiciousActivityController(
            SuspiciousActivityService suspiciousActivityService) {

        this.suspiciousActivityService =
                suspiciousActivityService;
    }

    // Analyze login activity
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeActivity(
            @RequestParam String email) {

        SuspiciousActivity activity =
                suspiciousActivityService
                        .analyzeActivity(email);

        if (activity == null) {

            return ResponseEntity.ok(
                    "No suspicious activity detected"
            );
        }

        return ResponseEntity.ok(activity);
    }

    // Get suspicious activities for a user
    @GetMapping
    public ResponseEntity<List<SuspiciousActivity>>
            getSuspiciousActivities(
                    @RequestParam String email) {

        return ResponseEntity.ok(
                suspiciousActivityService
                        .getSuspiciousActivities(email)
        );
    }

    // Get all suspicious activities
    @GetMapping("/all")
    public ResponseEntity<List<SuspiciousActivity>>
            getAllSuspiciousActivities() {

        return ResponseEntity.ok(
                suspiciousActivityService
                        .getAllSuspiciousActivities()
        );
    }
}