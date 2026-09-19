package com.securevault.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.entity.User;

public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {

    List<SecurityAlert>
            findByUserOrderByCreatedAtDesc(User user);

    List<SecurityAlert>
            findAllByOrderByCreatedAtDesc();
}