import "./Settings.css";

function Settings() {
  return (
    <div className="settings-container">
      <h1>⚙️ Settings</h1>

      <div className="settings-card">
        <h3>Theme</h3>
        <p>🌙 Dark Mode</p>

        <h3>Security</h3>
        <p>🔒 Change Password</p>

        <h3>Session</h3>
        <p>⏱ Auto Logout: 10 Minutes</p>

        <h3>Notifications</h3>
        <p>🔔 Email Notifications</p>
      </div>
    </div>
  );
}

export default Settings;