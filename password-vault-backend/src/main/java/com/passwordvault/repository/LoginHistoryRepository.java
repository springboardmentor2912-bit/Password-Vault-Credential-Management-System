package com.passwordvault.repository;

import com.passwordvault.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginHistoryRepository
        extends JpaRepository<LoginHistory, Long> {

    List<LoginHistory> findByEmailOrderByLoginTimeDesc(String email);
}