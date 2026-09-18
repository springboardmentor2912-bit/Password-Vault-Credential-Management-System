package com.passwordvault.controller;

import com.passwordvault.entity.LoginHistory;
import com.passwordvault.repository.LoginHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login-history")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginHistoryController {

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @GetMapping
    public List<LoginHistory> getLoginHistory(
            Authentication authentication) {

        String email = authentication.getName();

        return loginHistoryRepository
                .findByEmailOrderByLoginTimeDesc(email);
    }
}