package com.securevault.backend.dto;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private String type;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead;

    public NotificationResponse() {
    }

    public NotificationResponse(
            Long id,
            String type,
            String title,
            String message,
            LocalDateTime createdAt,
            boolean isRead) {

        this.id = id;
        this.type = type;
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
        this.isRead = isRead;
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isRead() {
        return isRead;
    }
}