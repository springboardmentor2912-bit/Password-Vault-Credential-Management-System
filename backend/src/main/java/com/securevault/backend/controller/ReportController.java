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

import com.securevault.backend.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService) {

        this.reportService = reportService;
    }


    // ==========================================
    // PASSWORD HEALTH REPORT
    // ==========================================

    @GetMapping("/password-health")
    public ResponseEntity<?> getPasswordHealthReport(
            @RequestParam String email) {

        try {

            return ResponseEntity.ok(
                    reportService.getPasswordHealthReport(email)
            );

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put("error", "User not found");
            error.put("message",
                    "No user exists with the provided email");

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }
    }


    // ==========================================
    // LOGIN ACTIVITY REPORT
    // ==========================================

    @GetMapping("/login-activity")
    public ResponseEntity<?> getLoginActivityReport(
            @RequestParam String email) {

        try {

            return ResponseEntity.ok(
                    reportService.getLoginActivityReport(email)
            );

        } catch (RuntimeException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put("error", "User not found");
            error.put("message",
                    "Unable to generate login activity report");

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }
    }

}