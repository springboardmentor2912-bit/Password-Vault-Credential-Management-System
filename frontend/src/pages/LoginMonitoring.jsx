import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoginActivities } from "../services/api";
import "./LoginMonitoring.css";

function LoginMonitoring() {
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

      const response = await getLoginActivities();

      if (Array.isArray(response.data)) {
        setActivities(response.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error loading login activities:", error);
      setError("Unable to load login activities.");
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
    <div className="login-monitoring-page">

      <div className="monitoring-topbar">

        <button
          className="monitoring-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

        <button
          className="monitoring-refresh-btn"
          onClick={loadActivities}
        >
          Refresh
        </button>

      </div>

      <div className="monitoring-heading">

        <h1>Login Monitoring</h1>

        <p>
          Monitor your recent login activities.
        </p>

      </div>

      {loading && (
        <div className="monitoring-message">
          Loading login activities...
        </div>
      )}

      {error && (
        <div className="monitoring-error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        activities.length === 0 && (
          <div className="monitoring-message">
            No login activities found.
          </div>
        )}

      {!loading &&
        !error &&
        activities.length > 0 && (
          <div className="login-activity-card">

            <div className="login-activity-table-wrapper">

              <table className="login-activity-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Login Time</th>
                  </tr>
                </thead>

                <tbody>

                  {activities.map((activity) => (

                    <tr key={activity.id}>

                      <td>
                        {activity.id}
                      </td>

                      <td className="activity-email">
                        {activity.email}
                      </td>

                      <td>

                        <span
                          className={
                            activity.status === "SUCCESS"
                              ? "login-status success"
                              : "login-status failed"
                          }
                        >
                          {activity.status}
                        </span>

                      </td>

                      <td className="activity-time">
                        {formatDateTime(activity.loginTime)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

    </div>
  );
}

export default LoginMonitoring;