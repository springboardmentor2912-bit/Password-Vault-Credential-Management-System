package com.passwordvault.controller;

import com.passwordvault.util.PasswordGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    @GetMapping("/generate")
    public Map<String, String> generatePassword(
            @RequestParam(defaultValue = "12") int length) {

        String password = PasswordGenerator.generatePassword(length);

        Map<String, String> response = new HashMap<>();
        response.put("password", password);

        return response;
    }
}