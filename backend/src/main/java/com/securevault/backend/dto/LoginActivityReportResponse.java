package com.securevault.backend.dto;

import java.util.List;

public class LoginActivityReportResponse {

    private long totalAttempts;

    private long successfulLogins;

    private long failedLogins;

    private double successfulPercentage;

    private double failedPercentage;

    private List<LoginActivityResponse> recentActivities;


    public LoginActivityReportResponse() {
    }


    public LoginActivityReportResponse(
            long totalAttempts,
            long successfulLogins,
            long failedLogins,
            double successfulPercentage,
            double failedPercentage,
            List<LoginActivityResponse> recentActivities) {

        this.totalAttempts = totalAttempts;
        this.successfulLogins = successfulLogins;
        this.failedLogins = failedLogins;
        this.successfulPercentage = successfulPercentage;
        this.failedPercentage = failedPercentage;
        this.recentActivities = recentActivities;
    }


    public long getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(long totalAttempts) {
        this.totalAttempts = totalAttempts;
    }


    public long getSuccessfulLogins() {
        return successfulLogins;
    }

    public void setSuccessfulLogins(long successfulLogins) {
        this.successfulLogins = successfulLogins;
    }


    public long getFailedLogins() {
        return failedLogins;
    }

    public void setFailedLogins(long failedLogins) {
        this.failedLogins = failedLogins;
    }


    public double getSuccessfulPercentage() {
        return successfulPercentage;
    }

    public void setSuccessfulPercentage(double successfulPercentage) {
        this.successfulPercentage = successfulPercentage;
    }


    public double getFailedPercentage() {
        return failedPercentage;
    }

    public void setFailedPercentage(double failedPercentage) {
        this.failedPercentage = failedPercentage;
    }


    public List<LoginActivityResponse> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(
            List<LoginActivityResponse> recentActivities) {

        this.recentActivities = recentActivities;
    }
}