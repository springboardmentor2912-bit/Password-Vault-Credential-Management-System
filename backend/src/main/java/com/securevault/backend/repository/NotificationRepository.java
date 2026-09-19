package com.securevault.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securevault.backend.entity.Notification;
import com.securevault.backend.entity.User;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);

    long countByUserAndIsReadFalse(User user);
}