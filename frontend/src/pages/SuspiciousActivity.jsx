import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSuspiciousActivities } from "../services/api";

function SuspiciousActivity() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuspiciousActivities();

      if (Array.isArray(response.data)) {
        setActivities(response.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error(
        "Error loading suspicious activities:",
        error
      );

      setError(
        "Unable to load suspicious activities."
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

            <h1>Security Alerts</h1>

            <p>
              Monitor suspicious login activities detected by SecureVault.
            </p>
          </div>

          <button
            className="suspicious-refresh-button"
            onClick={loadActivities}
          >
            Refresh
          </button>

        </div>

        {loading && (
          <div className="suspicious-message">
            Checking for suspicious activities...
          </div>
        )}

        {error && (
          <div className="suspicious-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          activities.length === 0 && (
            <div className="no-suspicious-activity">

              <div className="safe-icon">
                🛡️
              </div>

              <h2>No Suspicious Activity</h2>

              <p>
                No unusual login activity has been detected.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          activities.length > 0 && (

            <div className="suspicious-list">

              {activities.map((activity) => (

                <div
                  className="suspicious-item"
                  key={activity.id}
                >

                  <div className="suspicious-item-icon">
                    🚨
                  </div>

                  <div className="suspicious-item-content">

                    <div className="suspicious-item-top">

                      <h3>
                        {activity.activityType}
                      </h3>

                      <span className="suspicious-status">
                        {activity.status}
                      </span>

                    </div>

                    <p>
                      {activity.description}
                    </p>

                    <span className="suspicious-time">
                      Detected:{" "}
                      {formatDateTime(
                        activity.detectedAt
                      )}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        <button
          className="suspicious-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default SuspiciousActivity;