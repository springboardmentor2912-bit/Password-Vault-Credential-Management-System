package com.securevault.backend.dto;

import java.time.LocalDateTime;

public class LoginActivityResponse {

    private Long id;
    private String email;
    private String status;
    private LocalDateTime timestamp;

    public LoginActivityResponse() {
    }

    public LoginActivityResponse(
            Long id,
            String email,
            String status,
            LocalDateTime timestamp) {

        this.id = id;
        this.email = email;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}