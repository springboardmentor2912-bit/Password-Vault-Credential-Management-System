package com.securevault.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.entity.User;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

    List<LoginActivity> findByUserOrderByTimestampDesc(User user);

    List<LoginActivity> findByEmailOrderByTimestampDesc(String email);

    List<LoginActivity> findAllByOrderByTimestampDesc();
}