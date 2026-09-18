package com.securevault.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginActivityReportResponse {

    private long totalAttempts;

    private long successfulLogins;

    private long failedLogins;

    private Object recentLoginActivities;
}