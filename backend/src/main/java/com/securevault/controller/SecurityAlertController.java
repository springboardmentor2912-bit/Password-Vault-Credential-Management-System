package com.securevault.controller;

import com.securevault.entity.SecurityAlert;
import com.securevault.service.SecurityAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-alerts")
@RequiredArgsConstructor
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    @GetMapping
    public List<SecurityAlert> getAllSecurityAlerts() {
        return securityAlertService.getAllSecurityAlerts();
    }
}