import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSecurityAnalytics } from "../services/api";
import "./SecurityAnalytics.css";
function SecurityAnalytics() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSecurityAnalytics();

      setAnalytics(response.data);
    } catch (err) {
      console.error("Failed to load security analytics:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError("Unable to load security analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading">
        Loading security analytics...
      </div>
    );
  }

  return (
    <div className="analytics-page">

      <div className="analytics-container">

        {/* HEADER */}

        <div className="analytics-header">

          <div>
            <div className="analytics-icon">
              🛡️
            </div>

            <h1>Security Analytics</h1>

            <p>
              Monitor and understand your account security activity.
            </p>
          </div>

          <button
            className="analytics-refresh-button"
            onClick={fetchAnalytics}
          >
            Refresh
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="analytics-error">
            {error}
          </div>
        )}


        {analytics && (
          <>

            {/* STATISTICS */}

            <div className="analytics-stats">

              <div className="analytics-stat-card">
                <div className="analytics-stat-icon">
                  📊
                </div>

                <div>
                  <p>Total Logins</p>
                  <h2>{analytics.totalLogins}</h2>
                </div>
              </div>


              <div className="analytics-stat-card success-stat">
                <div className="analytics-stat-icon">
                  ✅
                </div>

                <div>
                  <p>Successful Logins</p>
                  <h2>{analytics.successfulLogins}</h2>
                </div>
              </div>


              <div className="analytics-stat-card failed-stat">
                <div className="analytics-stat-icon">
                  ❌
                </div>

                <div>
                  <p>Failed Logins</p>
                  <h2>{analytics.failedLogins}</h2>
                </div>
              </div>


              <div className="analytics-stat-card suspicious-stat">
                <div className="analytics-stat-icon">
                  ⚠️
                </div>

                <div>
                  <p>Suspicious Activities</p>
                  <h2>{analytics.suspiciousActivities}</h2>
                </div>
              </div>


              <div className="analytics-stat-card alert-stat">
                <div className="analytics-stat-icon">
                  🚨
                </div>

                <div>
                  <p>Security Alerts</p>
                  <h2>{analytics.securityAlerts}</h2>
                </div>
              </div>

            </div>


            {/* RECENT LOGIN ACTIVITY */}

            <section className="analytics-section">

              <div className="analytics-section-header">
                <div>
                  <h2>Login Activity</h2>
                  <p>
                    Recent successful and failed login attempts.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/login-monitoring")}
                  className="analytics-view-button"
                >
                  View All
                </button>
              </div>


              {analytics.recentLoginActivities?.length === 0 ? (

                <div className="analytics-empty">
                  No login activity found.
                </div>

              ) : (

                <div className="analytics-table-wrapper">

                  <table className="analytics-table">

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Login Time</th>
                      </tr>
                    </thead>

                    <tbody>

                      {analytics.recentLoginActivities
                        .slice(0, 5)
                        .map((activity) => (

                          <tr key={activity.id}>

                            <td>
                              {activity.id}
                            </td>

                            <td>
                              {activity.email}
                            </td>

                            <td>

                              <span
                                className={
                                  activity.status === "SUCCESS"
                                    ? "analytics-status success"
                                    : "analytics-status failed"
                                }
                              >
                                {activity.status}
                              </span>

                            </td>

                            <td>
                              {new Date(
                                activity.loginTime
                              ).toLocaleString()}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            {/* SECURITY ALERTS + SUSPICIOUS ACTIVITIES */}

            <div className="analytics-two-column">


              {/* SUSPICIOUS ACTIVITIES */}

              <section className="analytics-section">

                <div className="analytics-section-header">

                  <div>
                    <h2>Suspicious Activities</h2>
                    <p>
                      Detected activities requiring attention.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/suspicious-activities")
                    }
                    className="analytics-view-button"
                  >
                    View All
                  </button>

                </div>


                {analytics.recentSuspiciousActivities?.length ===
                0 ? (

                  <div className="analytics-empty">
                    No suspicious activities found.
                  </div>

                ) : (

                  <div className="analytics-list">

                    {analytics.recentSuspiciousActivities
                      .slice(0, 4)
                      .map((activity) => (

                        <div
                          className="analytics-list-item"
                          key={activity.id}
                        >

                          <div className="analytics-list-icon">
                            ⚠️
                          </div>

                          <div className="analytics-list-content">

                            <h3>
                              {activity.activityType}
                            </h3>

                            <p>
                              {activity.description}
                            </p>

                            <small>
                              {new Date(
                                activity.detectedAt
                              ).toLocaleString()}
                            </small>

                          </div>

                          <span className="analytics-status failed">
                            {activity.status}
                          </span>

                        </div>

                      ))}

                  </div>

                )}

              </section>


              {/* SECURITY ALERTS */}

              <section className="analytics-section">

                <div className="analytics-section-header">

                  <div>
                    <h2>Security Alerts</h2>
                    <p>
                      Important security warnings.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/security-alerts")
                    }
                    className="analytics-view-button"
                  >
                    View All
                  </button>

                </div>


                {analytics.recentSecurityAlerts?.length === 0 ? (

                  <div className="analytics-empty">
                    No security alerts found.
                  </div>

                ) : (

                  <div className="analytics-list">

                    {analytics.recentSecurityAlerts
                      .slice(0, 4)
                      .map((alert) => (

                        <div
                          className="analytics-list-item alert-item"
                          key={alert.id}
                        >

                          <div className="analytics-list-icon">
                            🚨
                          </div>

                          <div className="analytics-list-content">

                            <h3>
                              {alert.alertType}
                            </h3>

                            <p>
                              {alert.message}
                            </p>

                            <small>
                              Severity: {alert.severity} •{" "}
                              {new Date(
                                alert.createdAt
                              ).toLocaleString()}
                            </small>

                          </div>

                          <span className="analytics-status failed">
                            {alert.status}
                          </span>

                        </div>

                      ))}

                  </div>

                )}

              </section>

            </div>


            {/* AUDIT LOGS */}

            <section className="analytics-section">

              <div className="analytics-section-header">

                <div>
                  <h2>Recent Activity</h2>
                  <p>
                    Important security activities recorded by SecureVault.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/audit-logs")}
                  className="analytics-view-button"
                >
                  View All
                </button>

              </div>


              {analytics.recentAuditLogs?.length === 0 ? (

                <div className="analytics-empty">
                  No recent activity found.
                </div>

              ) : (

                <div className="analytics-table-wrapper">

                  <table className="analytics-table">

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Action</th>
                        <th>Description</th>
                        <th>Time</th>
                      </tr>
                    </thead>

                    <tbody>

                      {analytics.recentAuditLogs
                        .slice(0, 5)
                        .map((log) => (

                          <tr key={log.id}>

                            <td>
                              {log.id}
                            </td>

                            <td>
                              {log.action}
                            </td>

                            <td>
                              {log.description}
                            </td>

                            <td>
                              {new Date(
                                log.timestamp
                              ).toLocaleString()}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            {/* BACK */}

            <button
              className="analytics-back-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>

          </>
        )}

      </div>

    </div>
  );
}

export default SecurityAnalytics;