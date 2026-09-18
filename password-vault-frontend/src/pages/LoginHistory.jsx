import { useEffect, useState } from "react";
import axios from "axios";
import "./LoginHistory.css";

function LoginHistory() {

  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

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

      setHistory(response.data);

    } catch (error) {

      console.log("Login history error:", error);

    } finally {

      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {

    if (filter === "ALL") {
      return true;
    }

    return item.status === filter;
  });

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className="login-history-container">

      <div className="login-history-header">

        <div>
          <h1>Login History</h1>
          <p>Track your login attempts</p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="history-filter"
        >
          <option value="ALL">All</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>

      </div>

      {loading ? (

        <p className="loading-text">
          Loading login history...
        </p>

      ) : filteredHistory.length === 0 ? (

        <div className="empty-history">
          No login history found.
        </div>

      ) : (

        <div className="history-table-wrapper">

          <table className="history-table">

            <thead>
              <tr>
                <th>#</th>
                <th>EMAIL</th>
                <th>STATUS</th>
                <th>DATE & TIME</th>
              </tr>
            </thead>

            <tbody>

              {filteredHistory.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>
                    {item.email}
                  </td>

                  <td>

                    <span
                      className={
                        item.status === "SUCCESS"
                          ? "status-success"
                          : "status-failed"
                      }
                    >
                      {item.status === "SUCCESS"
                        ? "✓ SUCCESS"
                        : "✕ FAILED"}
                    </span>

                  </td>

                  <td>
                    {formatDate(item.loginTime)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default LoginHistory;