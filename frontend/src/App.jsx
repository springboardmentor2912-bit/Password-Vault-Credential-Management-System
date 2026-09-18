import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Vault from "./pages/Vault";
import LoginMonitoring from "./pages/LoginMonitoring";
import SuspiciousActivity from "./pages/SuspiciousActivity";
import SecurityAlerts from "./pages/SecurityAlerts";
import AuditLogs from "./pages/AuditLogs";
import SecurityAnalytics from "./pages/SecurityAnalytics";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            VAULT
        ========================= */}

        <Route
          path="/vault"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/vault/add"
          element={
            <ProtectedRoute>
              <Vault initialPage="add" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vault/credentials"
          element={
            <ProtectedRoute>
              <Vault initialPage="credentials" />
            </ProtectedRoute>
          }
        />


        {/* =========================
            SECURITY
        ========================= */}

        <Route
          path="/login-monitoring"
          element={
            <ProtectedRoute>
              <LoginMonitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suspicious-activities"
          element={
            <ProtectedRoute>
              <SuspiciousActivity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security-alerts"
          element={
            <ProtectedRoute>
              <SecurityAlerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogs />
            </ProtectedRoute>
          }
        />


        {/* =========================
            SECURITY ANALYTICS
        ========================= */}

        <Route
          path="/security-analytics"
          element={
            <ProtectedRoute>
              <SecurityAnalytics />
            </ProtectedRoute>
          }
        />


        {/* =========================
            SECURITY REPORTS
        ========================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />


        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />


        {/* =========================
            UNKNOWN ROUTES
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;