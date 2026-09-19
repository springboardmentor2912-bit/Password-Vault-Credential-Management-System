package com.securevault.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.securevault.backend.dto.LoginActivityResponse;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.repository.LoginActivityRepository;

@Service
public class LoginActivityService {

    private final LoginActivityRepository loginActivityRepository;

    public LoginActivityService(
            LoginActivityRepository loginActivityRepository) {

        this.loginActivityRepository =
                loginActivityRepository;
    }

    // Get login activities for a specific email
    public List<LoginActivityResponse> getLoginActivities(
            String email) {

        return loginActivityRepository
                .findByEmailOrderByTimestampDesc(email)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get all login activities
    public List<LoginActivityResponse> getAllLoginActivities() {

        return loginActivityRepository
                .findAllByOrderByTimestampDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private LoginActivityResponse convertToResponse(
            LoginActivity activity) {

        return new LoginActivityResponse(
                activity.getId(),
                activity.getEmail(),
                activity.getStatus().name(),
                activity.getTimestamp()
        );
    }
}