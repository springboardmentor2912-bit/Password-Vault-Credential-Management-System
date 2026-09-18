import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/api";
import "./Notifications.css";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "";
    }

    return new Date(dateTime).toLocaleString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "SUCCESSFUL_LOGIN":
        return "🔐";

      case "MULTIPLE_FAILED_LOGINS":
        return "🚨";

      case "CREDENTIAL_SHARED":
        return "🤝";

      case "PASSWORD_EXPIRATION":
        return "🔑";

      case "SUSPICIOUS_ACTIVITY":
        return "⚠️";

      default:
        return "🔔";
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="notifications-page">

      <div className="notifications-card">

        {/* HEADER */}

        <div className="notifications-header">

          <div>
            <div className="notifications-logo">
              🔔
            </div>

            <h1>Notifications</h1>

            <p>
              Stay updated about your SecureVault account security.
            </p>
          </div>

          <button
            className="notifications-back-button"
            onClick={handleBack}
          >
            ← Dashboard
          </button>

        </div>


        {/* REFRESH */}

        <div className="notifications-toolbar">

          <span>
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
          </span>

          <button
            className="notifications-refresh-button"
            onClick={fetchNotifications}
          >
            🔄 Refresh
          </button>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="notifications-status">
            Loading notifications...
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="notifications-error">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="notifications-empty">

              <div className="notifications-empty-icon">
                🔔
              </div>

              <h2>No notifications</h2>

              <p>
                You are all caught up!
              </p>

            </div>
          )}


        {/* NOTIFICATION LIST */}

        {!loading &&
          !error &&
          notifications.length > 0 && (

            <div className="notifications-list">

              {notifications.map((notification) => (

                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.read
                      ? "notification-read"
                      : "notification-unread"
                  }`}
                >

                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>


                  <div className="notification-content">

                    <div className="notification-title-row">

                      <h3>
                        {notification.title}
                      </h3>

                      {!notification.read && (
                        <span className="notification-new-badge">
                          NEW
                        </span>
                      )}

                    </div>


                    <p className="notification-message">
                      {notification.message}
                    </p>


                    <div className="notification-footer">

                      <span className="notification-time">
                        🕒 {formatDateTime(notification.createdAt)}
                      </span>


                      {!notification.read && (
                        <button
                          className="notification-read-button"
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                        >
                          ✓ Mark as read
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </div>
  );
}

export default Notifications;