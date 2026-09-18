package com.securevault.controller;

import com.securevault.dto.LoginActivityReportResponse;
import com.securevault.dto.PasswordHealthReportResponse;
import com.securevault.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;


    // ==============================
    // PASSWORD HEALTH REPORT
    // ==============================

    @GetMapping("/password-health")
    public PasswordHealthReportResponse getPasswordHealthReport(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return reportService.getPasswordHealthReport(email);
    }


    // ==============================
    // LOGIN ACTIVITY REPORT
    // ==============================

    @GetMapping("/login-activity")
    public LoginActivityReportResponse getLoginActivityReport(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return reportService.getLoginActivityReport(email);
    }
}