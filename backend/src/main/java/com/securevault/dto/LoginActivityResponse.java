package com.securevault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class LoginActivityResponse {

    private Long id;
    private String email;
    private String status;
    private LocalDateTime loginTime;
}