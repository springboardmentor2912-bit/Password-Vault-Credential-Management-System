package com.securevault.repository;

import com.securevault.entity.SecurityAlert;
import com.securevault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {

    // Get security alerts of a particular user
    List<SecurityAlert> findByUserOrderByCreatedAtDesc(User user);

    // Get all security alerts
    List<SecurityAlert> findAllByOrderByCreatedAtDesc();

    // Count security alerts of a particular user
    long countByUser(User user);
}