import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

// Main pages
import Dashboard from "./pages/Dashboard";
import AddCredential from "./pages/AddCredential";
import Credentials from "./pages/Credentials";
import UpdateCredential from "./pages/UpdateCredential";
import Profile from "./pages/Profile";

// Security Analytics
import SecurityAnalytics from "./pages/SecurityAnalytics";

// Security monitoring pages
import LoginActivities from "./pages/LoginActivities";
import SuspiciousActivity from "./pages/SuspiciousActivity";
import SecurityAlerts from "./pages/SecurityAlerts";
import AuditLogs from "./pages/AuditLogs";

import SecurityReports from "./pages/SecurityReports";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    AUTHENTICATION
                ========================= */}

                <Route
                    path="/"
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
                    CREDENTIALS
                ========================= */}

                <Route
                    path="/add-credential"
                    element={
                        <ProtectedRoute>
                            <AddCredential />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/credentials"
                    element={
                        <ProtectedRoute>
                            <Credentials />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/update-credential/:id"
                    element={
                        <ProtectedRoute>
                            <UpdateCredential />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    PROFILE
                ========================= */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
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
                    SECURITY MONITORING
                ========================= */}

                <Route
                    path="/login-activities"
                    element={
                        <ProtectedRoute>
                            <LoginActivities />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/suspicious-activity"
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
                <Route
    path="/security-reports"
    element={
        <ProtectedRoute>
            <SecurityReports />
        </ProtectedRoute>
    }
/>

            </Routes>
            

        </BrowserRouter>
    );
}

export default App;