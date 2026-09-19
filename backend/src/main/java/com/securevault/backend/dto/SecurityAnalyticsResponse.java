package com.securevault.backend.dto;

import java.util.List;

public class SecurityAnalyticsResponse {

    // Login statistics
    private long totalLogins;
    private long successfulLogins;
    private long failedLogins;

    // Security statistics
    private long suspiciousActivities;
    private long securityAlerts;
    private long auditLogs;

    // Recent activities
    private List<RecentActivity> recentActivities;

    public SecurityAnalyticsResponse() {
    }

    public SecurityAnalyticsResponse(
            long totalLogins,
            long successfulLogins,
            long failedLogins,
            long suspiciousActivities,
            long securityAlerts,
            long auditLogs,
            List<RecentActivity> recentActivities) {

        this.totalLogins = totalLogins;
        this.successfulLogins = successfulLogins;
        this.failedLogins = failedLogins;
        this.suspiciousActivities = suspiciousActivities;
        this.securityAlerts = securityAlerts;
        this.auditLogs = auditLogs;
        this.recentActivities = recentActivities;
    }

    public long getTotalLogins() {
        return totalLogins;
    }

    public void setTotalLogins(long totalLogins) {
        this.totalLogins = totalLogins;
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

    public long getSuspiciousActivities() {
        return suspiciousActivities;
    }

    public void setSuspiciousActivities(long suspiciousActivities) {
        this.suspiciousActivities = suspiciousActivities;
    }

    public long getSecurityAlerts() {
        return securityAlerts;
    }

    public void setSecurityAlerts(long securityAlerts) {
        this.securityAlerts = securityAlerts;
    }

    public long getAuditLogs() {
        return auditLogs;
    }

    public void setAuditLogs(long auditLogs) {
        this.auditLogs = auditLogs;
    }

    public List<RecentActivity> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(
            List<RecentActivity> recentActivities) {

        this.recentActivities = recentActivities;
    }

    public static class RecentActivity {

        private String type;
        private String description;
        private String timestamp;

        public RecentActivity() {
        }

        public RecentActivity(
                String type,
                String description,
                String timestamp) {

            this.type = type;
            this.description = description;
            this.timestamp = timestamp;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }
    }
}