import { useEffect, useState } from "react";
import axios from "axios";
import "./SecurityReports.css";

function SecurityReports() {

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCredentials = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://securevault-osrq.onrender.com/api/credentials",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCredentials(response.data);

    } catch (error) {

      console.log("Security Reports Error:", error);

      alert("Unable to load security report.");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  // ==========================
  // PASSWORD STRENGTH
  // ==========================

  const getPasswordStrength = (password) => {

    if (!password) {
      return "WEAK";
    }

    let score = 0;

    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 4) {
      return "STRONG";
    }

    if (score >= 2) {
      return "MEDIUM";
    }

    return "WEAK";
  };

  const total = credentials.length;

  const strong = credentials.filter(
    (item) =>
      getPasswordStrength(item.password) === "STRONG"
  ).length;

  const medium = credentials.filter(
    (item) =>
      getPasswordStrength(item.password) === "MEDIUM"
  ).length;

  const weak = credentials.filter(
    (item) =>
      getPasswordStrength(item.password) === "WEAK"
  ).length;

  const overallHealth =
    total === 0
      ? 0
      : Math.round((strong / total) * 100);

  return (

    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>

          <h1>
            📊 Security Reports
          </h1>

          <p>
            Analyze password health and login
            activity of your Secure Vault.
          </p>

        </div>

        <button
          className="report-refresh"
          onClick={loadCredentials}
        >
          🔄 Refresh
        </button>

      </div>


      {/* PASSWORD HEALTH */}

      <div className="health-section">

        <div className="section-heading">

          <h2>
            🔑 Password Health
          </h2>

          <p>
            Overview of the strength of your
            stored passwords.
          </p>

        </div>


        {loading ? (

          <div className="report-loading">
            Loading password health...
          </div>

        ) : (

          <>

            {/* STAT CARDS */}

            <div className="health-cards">

              <div className="health-card total-card">

                <div className="health-icon">
                  🔐
                </div>

                <h3>Total Credentials</h3>

                <strong>{total}</strong>

                <p>Stored credentials</p>

              </div>


              <div className="health-card strong-card">

                <div className="health-icon">
                  🔒
                </div>

                <h3>Strong Passwords</h3>

                <strong>{strong}</strong>

                <p>Excellent protection</p>

              </div>


              <div className="health-card medium-card">

                <div className="health-icon">
                  ⚠️
                </div>

                <h3>Medium Passwords</h3>

                <strong>{medium}</strong>

                <p>Can be improved</p>

              </div>


              <div className="health-card weak-card">

                <div className="health-icon">
                  🔓
                </div>

                <h3>Weak Passwords</h3>

                <strong>{weak}</strong>

                <p>Needs attention</p>

              </div>

            </div>


            {/* OVERALL HEALTH */}

            <div className="overall-health">

              <div className="overall-title">

                <div>

                  <h3>
                    Overall Password Health
                  </h3>

                  <p>
                    Based on your password strength analysis
                  </p>

                </div>

                <strong>
                  {overallHealth}%
                </strong>

              </div>


              <div className="health-progress">

                <div
                  className="health-progress-fill"
                  style={{
                    width: `${overallHealth}%`,
                  }}
                />

              </div>


              <div className="health-status">

                {overallHealth >= 80
                  ? "Excellent"
                  : overallHealth >= 50
                  ? "Needs Improvement"
                  : "Weak Security"}

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default SecurityReports;