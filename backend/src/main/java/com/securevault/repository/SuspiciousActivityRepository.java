package com.securevault.repository;

import com.securevault.entity.SuspiciousActivity;
import com.securevault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    // Get suspicious activities of a particular user
    List<SuspiciousActivity> findByUserOrderByDetectedAtDesc(User user);

    // Get all suspicious activities
    List<SuspiciousActivity> findAllByOrderByDetectedAtDesc();

    // Count suspicious activities of a particular user
    long countByUser(User user);
}