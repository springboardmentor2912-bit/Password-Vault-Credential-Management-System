import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSecurityAlerts } from "../services/api";

function SecurityAlerts() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSecurityAlerts();

      if (Array.isArray(response.data)) {
        setAlerts(response.data);
      } else {
        setAlerts([]);
      }

    } catch (error) {
      console.error(
        "Error loading security alerts:",
        error
      );

      setError(
        "Unable to load security alerts."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "N/A";
    }

    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="suspicious-page">

      <div className="suspicious-card">

        <div className="suspicious-header">

          <div>

            <div className="security-icon">
              🚨
            </div>

            <h1>
              Security Alerts
            </h1>

            <p>
              Review important security alerts detected in your account.
            </p>

          </div>

          <button
            className="suspicious-refresh-button"
            onClick={loadAlerts}
          >
            Refresh
          </button>

        </div>


        {loading && (
          <div className="suspicious-message">
            Loading security alerts...
          </div>
        )}


        {error && (
          <div className="suspicious-error">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          alerts.length === 0 && (

            <div className="no-suspicious-activity">

              <div className="safe-icon">
                🛡️
              </div>

              <h2>
                No Security Alerts
              </h2>

              <p>
                No security alerts have been detected.
              </p>

            </div>

          )}


        {!loading &&
          !error &&
          alerts.length > 0 && (

            <div className="suspicious-list">

              {alerts.map((alert) => (

                <div
                  className="suspicious-item"
                  key={alert.id}
                >

                  <div className="suspicious-item-icon">
                    ⚠️
                  </div>

                  <div className="suspicious-item-content">

                    <div className="suspicious-item-top">

                      <h3>
                        {alert.alertType}
                      </h3>

                      <span className="suspicious-status">
                        {alert.status}
                      </span>

                    </div>

                    <p>
                      {alert.message}
                    </p>

                    <div className="suspicious-time">
                      Severity:{" "}
                      <strong>
                        {alert.severity}
                      </strong>
                    </div>

                    <div className="suspicious-time">
                      Time:{" "}
                      {formatDateTime(
                        alert.createdAt
                      )}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}


        <button
          className="suspicious-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default SecurityAlerts;