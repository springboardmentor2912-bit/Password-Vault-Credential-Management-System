package com.securevault.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.User;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity> findByUserOrderByDetectedAtDesc(User user);

    List<SuspiciousActivity> findAllByOrderByDetectedAtDesc();
}