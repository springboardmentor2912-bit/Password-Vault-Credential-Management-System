import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">

      <h2>🔐 Password Vault</h2>

      <Link
        to="/dashboard"
        className={location.pathname === "/dashboard" ? "active" : ""}
      >
        🏠 Dashboard
      </Link>

      <Link
        to="/vault"
        className={location.pathname === "/vault" ? "active" : ""}
      >
        🔐 My Vault
      </Link>

      <Link
        to="/add"
        className={location.pathname === "/add" ? "active" : ""}
      >
        ➕ Add Credential
      </Link>

      <Link
        to="/favorites"
        className={location.pathname === "/favorites" ? "active" : ""}
      >
        ⭐ Favorites
      </Link>

      <Link
        to="/login-history"
        className={location.pathname === "/login-history" ? "active" : ""}
      >
        🕘 Login History
      </Link>

      <Link
        to="/security"
        className={location.pathname === "/security" ? "active" : ""}
      >
        🔒 Security
      </Link>

      <Link
        to="/security-reports"
        className={location.pathname === "/security-reports" ? "active" : ""}
      >
        📊 Security Reports
      </Link>

      <Link
        to="/profile"
        className={location.pathname === "/profile" ? "active" : ""}
      >
        👤 Profile
      </Link>

      <Link
        to="/settings"
        className={location.pathname === "/settings" ? "active" : ""}
      >
        ⚙️ Settings
      </Link>

      <Link to="/login">
        🚪 Logout
      </Link>

    </div>
  );
}

export default Sidebar;