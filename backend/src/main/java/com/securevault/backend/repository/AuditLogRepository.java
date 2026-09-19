package com.securevault.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.entity.User;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    // Get audit logs for a specific user
    List<AuditLog> findByUserOrderByTimestampDesc(User user);

    // Get all audit logs
    List<AuditLog> findAllByOrderByTimestampDesc();

    // Check whether a similar audit log already exists recently
    boolean existsByUserAndActionAndDescriptionAndTimestampAfter(
            User user,
            String action,
            String description,
            LocalDateTime timestamp
    );
}