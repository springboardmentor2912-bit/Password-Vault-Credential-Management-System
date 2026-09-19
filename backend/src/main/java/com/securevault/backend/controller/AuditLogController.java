package com.securevault.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.service.AuditLogService;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin("*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(
            AuditLogService auditLogService) {

        this.auditLogService = auditLogService;
    }

    // Create audit log
    @PostMapping
    public ResponseEntity<AuditLog> createLog(
            @RequestParam Long userId,
            @RequestParam String action,
            @RequestParam String description) {

        return ResponseEntity.ok(
                auditLogService.createLog(
                        userId,
                        action,
                        description
                )
        );
    }

    // Get audit logs for a specific user
    @GetMapping
    public ResponseEntity<List<AuditLog>> getLogs(
            @RequestParam String email) {

        return ResponseEntity.ok(
                auditLogService.getLogs(email)
        );
    }

    // Get all audit logs
    @GetMapping("/all")
    public ResponseEntity<List<AuditLog>> getAllLogs() {

        return ResponseEntity.ok(
                auditLogService.getAllLogs()
        );
    }
}