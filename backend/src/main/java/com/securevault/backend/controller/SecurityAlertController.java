package com.securevault.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.service.SecurityAlertService;

@RestController
@RequestMapping("/api/security-alerts")
@CrossOrigin("*")
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    public SecurityAlertController(
            SecurityAlertService securityAlertService) {

        this.securityAlertService = securityAlertService;
    }

    // Create security alert
    @PostMapping
    public ResponseEntity<SecurityAlert> createAlert(
            @RequestBody SuspiciousActivity suspiciousActivity) {

        return ResponseEntity.ok(
                securityAlertService.createAlert(
                        suspiciousActivity
                )
        );
    }

    // Get alerts for a specific user
    @GetMapping
    public ResponseEntity<List<SecurityAlert>> getAlerts(
            @RequestParam String email) {

        return ResponseEntity.ok(
                securityAlertService.getAlerts(email)
        );
    }

    // Get all security alerts
    @GetMapping("/all")
    public ResponseEntity<List<SecurityAlert>> getAllAlerts() {

        return ResponseEntity.ok(
                securityAlertService.getAllAlerts()
        );
    }
}