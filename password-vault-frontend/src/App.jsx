import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================
// Authentication Pages
// ==========================
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

// ==========================
// Main Pages
// ==========================
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import AddCredential from "./pages/AddCredential";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LoginHistory from "./pages/LoginHistory";

// ==========================
// Security Pages
// ==========================
import Security from "./pages/Security";
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
          element={<VerifyOTP />}
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
          element={<Dashboard />}
        />

        {/* =========================
            PASSWORD VAULT
        ========================= */}

        <Route
          path="/vault"
          element={<Vault />}
        />

        {/* =========================
            ADD CREDENTIAL
        ========================= */}

        <Route
          path="/add"
          element={<AddCredential />}
        />

        {/* =========================
            FAVORITES
        ========================= */}

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        {/* =========================
            PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* =========================
            SETTINGS
        ========================= */}

        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* =========================
            LOGIN HISTORY
        ========================= */}

        <Route
          path="/login-history"
          element={<LoginHistory />}
        />

        {/* =========================
            SECURITY MONITORING
        ========================= */}

        <Route
          path="/security"
          element={<Security />}
        />

        {/* =========================
            SECURITY REPORTS
        ========================= */}

        <Route
          path="/security-reports"
          element={<SecurityReports />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;