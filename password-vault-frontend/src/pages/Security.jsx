import { useEffect, useState } from "react";
import axios from "axios";
import "./Security.css";

function Security() {

  const [loginHistory, setLoginHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(true);

  const loadLoginHistory = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://securevault-osrq.onrender.com/api/login-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoginHistory(response.data);

    } catch (error) {

      console.log("Security Error:", error);

      alert("Unable to load security data.");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoginHistory();
  }, []);

  // ==========================
  // FAILED LOGINS
  // ==========================

  const failedLogins = loginHistory.filter(
    (item) => item.status === "FAILED"
  );

  const successfulLogins = loginHistory.filter(
    (item) => item.status === "SUCCESS"
  );

  // ==========================
  // SUSPICIOUS ACTIVITY
  // ==========================

  const suspiciousActivities = [];

  for (let i = 0; i < loginHistory.length; i++) {

    const current = loginHistory[i];

    if (current.status !== "FAILED") {
      continue;
    }

    const currentTime =
      new Date(current.loginTime).getTime();

    let failedCount = 0;

    for (let j = 0; j < loginHistory.length; j++) {

      if (loginHistory[j].status !== "FAILED") {
        continue;
      }

      const otherTime =
        new Date(loginHistory[j].loginTime).getTime();

      const difference =
        Math.abs(currentTime - otherTime);

      if (difference <= 5 * 60 * 1000) {
        failedCount++;
      }
    }

    if (failedCount >= 5) {

      suspiciousActivities.push(current);

    }
  }

  const uniqueSuspicious =
    Array.from(
      new Map(
        suspiciousActivities.map(
          (item) => [item.id, item]
        )
      ).values()
    );

  // ==========================
  // SECURITY ALERTS
  // ==========================

  const securityAlerts =
    uniqueSuspicious.map((item) => ({
      id: item.id,
      email: item.email,
      alertType: "MULTIPLE_FAILED_LOGINS",
      message:
        "5 failed login attempts detected within 5 minutes.",
      severity: "HIGH",
      time: item.loginTime,
      status: "Active",
    }));

  // ==========================
  // DATE
  // ==========================

  const formatDate = (dateTime) => {

    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleDateString("en-GB");
  };

  // ==========================
  // TIME
  // ==========================

  const formatTime = (dateTime) => {

    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleTimeString();
  };


  return (

    <div className="security-page">

      {/* HEADER */}

      <div className="security-header">

        <div>

          <h1>
            🛡️ Security Monitoring
          </h1>

          <p>
            Monitor login activity, suspicious
            activities, security alerts and audit logs.
          </p>

        </div>

        <button
          className="refresh-btn"
          onClick={loadLoginHistory}
        >
          🔄 Refresh
        </button>

      </div>


      {/* SUMMARY CARDS */}

      <div className="security-summary">

        <div className="summary-card">

          <h3>🔐 Login Attempts</h3>

          <strong>
            {loginHistory.length}
          </strong>

        </div>


        <div className="summary-card">

          <h3>🚨 Security Alerts</h3>

          <strong>
            {securityAlerts.length}
          </strong>

        </div>


        <div className="summary-card">

          <h3>⚠️ Suspicious Activities</h3>

          <strong>
            {uniqueSuspicious.length}
          </strong>

        </div>


        <div className="summary-card">

          <h3>📋 Audit Logs</h3>

          <strong>
            {loginHistory.length}
          </strong>

        </div>

      </div>


      {/* TABS */}

      <div className="security-tabs">

        <button
          className={
            activeTab === "login"
              ? "security-tab active"
              : "security-tab"
          }
          onClick={() => setActiveTab("login")}
        >
          🔐 Login Activity
        </button>

        <button
          className={
            activeTab === "alerts"
              ? "security-tab active"
              : "security-tab"
          }
          onClick={() => setActiveTab("alerts")}
        >
          🚨 Security Alerts
        </button>

        <button
          className={
            activeTab === "suspicious"
              ? "security-tab active"
              : "security-tab"
          }
          onClick={() => setActiveTab("suspicious")}
        >
          ⚠️ Suspicious Activities
        </button>

        <button
          className={
            activeTab === "audit"
              ? "security-tab active"
              : "security-tab"
          }
          onClick={() => setActiveTab("audit")}
        >
          📋 Audit Logs
        </button>

      </div>


      {/* LOGIN ACTIVITY */}

      {activeTab === "login" && (

        <div className="security-card">

          <h2>🔐 Login Activity</h2>

          {loading ? (

            <p>Loading...</p>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>DATE</th>
                    <th>TIME</th>
                    <th>EMAIL</th>
                    <th>STATUS</th>
                  </tr>

                </thead>

                <tbody>

                  {loginHistory.map((item) => (

                    <tr key={item.id}>

                      <td>
                        {formatDate(item.loginTime)}
                      </td>

                      <td>
                        {formatTime(item.loginTime)}
                      </td>

                      <td>
                        {item.email}
                      </td>

                      <td>

                        {item.status === "SUCCESS" ? (

                          <span className="status success">
                            ✓ SUCCESS
                          </span>

                        ) : (

                          <span className="status failed">
                            ✕ FAILED
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}


      {/* SECURITY ALERTS */}

      {activeTab === "alerts" && (

        <div className="security-card">

          <h2>
            🚨 Security Alerts
          </h2>

          {securityAlerts.length === 0 ? (

            <div className="empty-security">
              ✅ No active security alerts.
            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Alert Type</th>
                    <th>Message</th>
                    <th>Severity</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {securityAlerts.map((alert) => (

                    <tr key={alert.id}>

                      <td>{alert.id}</td>
                      <td>{alert.email}</td>

                      <td>
                        {alert.alertType}
                      </td>

                      <td>
                        {alert.message}
                      </td>

                      <td>
                        <span className="severity-high">
                          {alert.severity}
                        </span>
                      </td>

                      <td>
                        {formatTime(alert.time)}
                      </td>

                      <td>
                        <span className="alert-active">
                          {alert.status}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}


      {/* SUSPICIOUS ACTIVITIES */}

      {activeTab === "suspicious" && (

        <div className="security-card">

          <h2>
            ⚠️ Suspicious Activities
          </h2>

          {uniqueSuspicious.length === 0 ? (

            <div className="empty-security">
              ✅ No suspicious activities detected.
            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>

                </thead>

                <tbody>

                  {uniqueSuspicious.map((item) => (

                    <tr key={item.id}>

                      <td>{item.email}</td>

                      <td>
                        <span className="status failed">
                          ✕ FAILED
                        </span>
                      </td>

                      <td>
                        {formatDate(item.loginTime)}
                      </td>

                      <td>
                        {formatTime(item.loginTime)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}


      {/* AUDIT LOGS */}

      {activeTab === "audit" && (

        <div className="security-card">

          <h2>
            📋 Audit Logs
          </h2>

          {loginHistory.length === 0 ? (

            <div className="empty-security">
              No audit logs available.
            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>

                </thead>

                <tbody>

                  {loginHistory.map((item) => (

                    <tr key={item.id}>

                      <td>{item.id}</td>

                      <td>{item.email}</td>

                      <td>LOGIN</td>

                      <td>

                        {item.status === "SUCCESS" ? (

                          <span className="status success">
                            SUCCESS
                          </span>

                        ) : (

                          <span className="status failed">
                            FAILED
                          </span>

                        )}

                      </td>

                      <td>
                        {formatDate(item.loginTime)}
                      </td>

                      <td>
                        {formatTime(item.loginTime)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default Security;