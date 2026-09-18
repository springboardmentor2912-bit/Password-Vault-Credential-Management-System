package com.securevault.repository;

import com.securevault.entity.LoginActivity;
import com.securevault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

    // Get login activities of a particular user
    List<LoginActivity> findByUserOrderByLoginTimeDesc(User user);

    // Get all login activities
    List<LoginActivity> findAllByOrderByLoginTimeDesc();

    // Count all login activities of a user
    long countByUser(User user);

    // Count login activities by status
    long countByUserAndStatus(
            User user,
            String status
    );

    // Count login activities by status after a specific time
    long countByUserAndStatusAndLoginTimeAfter(
            User user,
            String status,
            LocalDateTime time
    );
}