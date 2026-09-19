package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.AuditLogRepository;
import com.securevault.backend.repository.UserRepository;

@Service
public class AuditLogService {

    private static final int DUPLICATE_WINDOW_MINUTES = 10;

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(
            AuditLogRepository auditLogRepository,
            UserRepository userRepository) {

        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    // Create audit log
    public AuditLog createLog(
            Long userId,
            String action,
            String description) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime windowStart =
                now.minusMinutes(DUPLICATE_WINDOW_MINUTES);

        // Prevent duplicate audit logs for the same activity
        boolean alreadyExists =
                auditLogRepository
                        .existsByUserAndActionAndDescriptionAndTimestampAfter(
                                user,
                                action,
                                description,
                                windowStart
                        );

        if (alreadyExists) {

            return auditLogRepository
                    .findByUserOrderByTimestampDesc(user)
                    .stream()
                    .filter(log ->
                            log.getAction().equals(action)
                    )
                    .filter(log ->
                            log.getDescription().equals(description)
                    )
                    .findFirst()
                    .orElse(null);
        }

        AuditLog log = new AuditLog();

        log.setUser(user);
        log.setAction(action);
        log.setDescription(description);
        log.setTimestamp(now);

        return auditLogRepository.save(log);
    }

    // Get audit logs for a specific user
    public List<AuditLog> getLogs(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return auditLogRepository
                .findByUserOrderByTimestampDesc(user);
    }

    // Get all audit logs
    public List<AuditLog> getAllLogs() {

        return auditLogRepository
                .findAllByOrderByTimestampDesc();
    }
}