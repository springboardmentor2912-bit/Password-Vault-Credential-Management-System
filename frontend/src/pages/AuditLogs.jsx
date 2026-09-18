import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuditLogs } from "../services/api";
import "./AuditLogs.css";

function AuditLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAuditLogs();

      if (Array.isArray(response.data)) {
        setLogs(response.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error(
        "Error loading audit logs:",
        error
      );

      setError(
        "Unable to load audit logs."
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
    <div className="login-monitoring-container">

      <div className="monitoring-header">

        <div>

          <div className="security-icon">
            
          </div>

          <h1>
            Audit Logs
          </h1>

          <p>
            View the history of important security activities.
          </p>

        </div>

        <button
          className="monitoring-refresh-btn"
          onClick={loadAuditLogs}
        >
          Refresh
        </button>

      </div>


      {loading && (
        <div className="monitoring-message">
          Loading audit logs...
        </div>
      )}


      {error && (
        <div className="monitoring-error">
          {error}
        </div>
      )}


      {!loading &&
        !error &&
        logs.length === 0 && (

          <div className="monitoring-message">

            

            <br />

            No audit logs found.

          </div>

        )}


      {!loading &&
        !error &&
        logs.length > 0 && (

          <div className="login-activity-table-wrapper">

            <table className="login-activity-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Action
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Time
                  </th>

                </tr>

              </thead>


              <tbody>

                {logs.map((log) => (

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
                      {formatDateTime(
                        log.timestamp
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

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
  );
}

export default AuditLogs;