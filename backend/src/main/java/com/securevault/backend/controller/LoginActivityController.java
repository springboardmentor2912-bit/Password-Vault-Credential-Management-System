package com.securevault.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.dto.LoginActivityResponse;
import com.securevault.backend.service.LoginActivityService;

@RestController
@RequestMapping("/api/login-activities")
@CrossOrigin("*")
public class LoginActivityController {

    private final LoginActivityService loginActivityService;

    public LoginActivityController(
            LoginActivityService loginActivityService) {

        this.loginActivityService =
                loginActivityService;
    }

    @GetMapping
    public ResponseEntity<List<LoginActivityResponse>>
            getLoginActivities(
                    @RequestParam String email) {

        return ResponseEntity.ok(
                loginActivityService
                        .getLoginActivities(email)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<List<LoginActivityResponse>>
            getAllLoginActivities() {

        return ResponseEntity.ok(
                loginActivityService
                        .getAllLoginActivities()
        );
    }
}