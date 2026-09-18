import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:8080/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// AUTHENTICATION
// =====================================================

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const forgotPassword = (data) =>
  api.post("/auth/forgot-password", data);

export const verifyOtp = (data) =>
  api.post("/auth/verify-otp", data);

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);

export const getProfile = () =>
  api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================================================
// VAULT
// =====================================================

export const getVaultEntries = () =>
  api.get("/vault", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getSharedVaultEntries = () =>
  api.get("/vault/shared", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const addVaultEntry = (data) =>
  api.post("/vault", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const updateVaultEntry = (id, data) =>
  api.put(`/vault/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const deleteVaultEntry = (id) =>
  api.delete(`/vault/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================================================
// SECURE SHARING
// =====================================================

export const shareVaultEntry = (id, email, permission) =>
  api.post(
    `/vault/${id}/share?sharedWithEmail=${encodeURIComponent(
      email
    )}&permission=${permission}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

// =====================================================
// LOGIN MONITORING
// =====================================================

export const getLoginActivities = () =>
  api.get("/monitoring/login-activities", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================================================
// SUSPICIOUS ACTIVITIES
// =====================================================

export const getSuspiciousActivities = () =>
  api.get("/monitoring/suspicious-activities", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================================================
// SECURITY ALERTS
// =====================================================

export const getSecurityAlerts = () =>
  api.get("/security-alerts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const markSecurityAlertAsRead = (id) =>
  api.put(
    `/security-alerts/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

// =====================================================
// AUDIT LOGS
// =====================================================

export const getAuditLogs = () =>
  api.get("/audit-logs", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================================================
// SECURITY ANALYTICS
// =====================================================

export const getSecurityAnalytics = () =>
  api.get("/security-analytics", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================================================
// SECURITY REPORTS
// =====================================================

export const getPasswordHealthReport = () =>
  api.get("/reports/password-health", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getLoginActivityReport = () =>
  api.get("/reports/login-activity", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// =====================================================
// NOTIFICATIONS
// =====================================================

export const getNotifications = () =>
  api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getUnreadNotificationCount = () =>
  api.get("/notifications/unread/count", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const markNotificationAsRead = (id) =>
  api.put(
    `/notifications/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;