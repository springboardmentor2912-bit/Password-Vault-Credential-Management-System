import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPasswordHealthReport,
  getLoginActivityReport,
} from "../services/api";
import "./Reports.css";

function Reports() {

  const navigate = useNavigate();

  const [passwordReport, setPasswordReport] = useState(null);
  const [loginReport, setLoginReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {

    try {

      setLoading(true);
      setError("");

      const [passwordResponse, loginResponse] =
        await Promise.all([
          getPasswordHealthReport(),
          getLoginActivityReport(),
        ]);

      setPasswordReport(passwordResponse.data);
      setLoginReport(loginResponse.data);

    } catch (err) {

      console.error("Error loading reports:", err);

      setError(
        "Unable to load security reports."
      );

    } finally {

      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="reports-page">

        <button
          className="reports-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h2>Security Reports</h2>

        <p>Loading reports...</p>

      </div>
    );
  }


  if (error) {
    return (
      <div className="reports-page">

        <button
          className="reports-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h2>Security Reports</h2>

        <p className="report-error">
          {error}
        </p>

      </div>
    );
  }


  return (
    <div className="reports-page">

      {/* =========================
          BACK TO DASHBOARD
      ========================= */}

      <button
        className="reports-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>


      {/* =========================
          REPORT HEADER
      ========================= */}

      <div className="reports-header">

        <h1>
          Security Reports
        </h1>

        <p>
          Overview of your password health and login activity
        </p>

      </div>


      {/* =========================
          PASSWORD HEALTH
      ========================= */}

      <section className="report-section">

        <h2>
          Password Health
        </h2>

        <div className="report-cards">

          <div className="report-card">

            <span>
              Total Credentials
            </span>

            <strong>
              {passwordReport?.totalCredentials ?? 0}
            </strong>

          </div>


          <div className="report-card strong-card">

            <span>
              Strong Passwords
            </span>

            <strong>
              {passwordReport?.strongPasswords ?? 0}
            </strong>

          </div>


          <div className="report-card medium-card">

            <span>
              Medium Passwords
            </span>

            <strong>
              {passwordReport?.mediumPasswords ?? 0}
            </strong>

          </div>


          <div className="report-card weak-card">

            <span>
              Weak Passwords
            </span>

            <strong>
              {passwordReport?.weakPasswords ?? 0}
            </strong>

          </div>

        </div>


        {/* OVERALL HEALTH */}

        <div className="health-summary">

          <h3>
            Overall Password Health
          </h3>

          <div className="health-score">
            {passwordReport?.healthScore ?? 0}%
          </div>

          <p>
            {getHealthMessage(
              passwordReport?.healthScore ?? 0
            )}
          </p>

        </div>

      </section>


      {/* =========================
          LOGIN ACTIVITY
      ========================= */}

      <section className="report-section">

        <h2>
          Login Activity
        </h2>


        <div className="report-cards">

          <div className="report-card">

            <span>
              Total Login Attempts
            </span>

            <strong>
              {loginReport?.totalAttempts ?? 0}
            </strong>

          </div>


          <div className="report-card success-card">

            <span>
              Successful Logins
            </span>

            <strong>
              {loginReport?.successfulLogins ?? 0}
            </strong>

          </div>


          <div className="report-card failed-card">

            <span>
              Failed Logins
            </span>

            <strong>
              {loginReport?.failedLogins ?? 0}
            </strong>

          </div>

        </div>


        {/* RECENT LOGIN ACTIVITIES */}

        <div className="login-table-container">

          <h3>
            Recent Login Activities
          </h3>

          {loginReport?.recentLoginActivities?.length > 0 ? (

            <table className="login-report-table">

              <thead>

                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Login Time</th>
                </tr>

              </thead>


              <tbody>

                {loginReport.recentLoginActivities.map(
                  (activity, index) => (

                    <tr key={index}>

                      <td>
                        {activity.email}
                      </td>

                      <td>

                        <span
                          className={
                            activity.status === "SUCCESS"
                              ? "status-success"
                              : "status-failed"
                          }
                        >
                          {activity.status}
                        </span>

                      </td>

                      <td>
                        {formatLoginTime(
                          activity.loginTime
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          ) : (

            <p className="no-login-data">
              No login activity available.
            </p>

          )}

        </div>

      </section>

    </div>
  );
}


/* =================================
   PASSWORD HEALTH MESSAGE
================================= */

function getHealthMessage(score) {

  if (score >= 80) {
    return "Excellent password health. Your credentials are generally strong.";
  }

  if (score >= 60) {
    return "Good password health, but some credentials could be improved.";
  }

  if (score >= 40) {
    return "Moderate password health. Consider strengthening weaker credentials.";
  }

  return "Your password health needs attention. Consider updating weak passwords.";
}


/* =================================
   LOGIN TIME FORMAT
================================= */

function formatLoginTime(loginTime) {

  if (!loginTime) {
    return "-";
  }

  return new Date(loginTime).toLocaleString();
}


export default Reports;