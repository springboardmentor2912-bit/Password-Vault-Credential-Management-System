import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function SecurityAlerts() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {

        try {

            const response = await api.get(
                `/security-alerts?email=${email}`
            );

            setAlerts(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const formatDateTime = (timestamp) => {

        return new Date(timestamp).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };

    return (

        <>
            <Navbar />

            <div
                className="container py-5"
                style={{ maxWidth: "1100px" }}
            >

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-2">
                            Security Alerts
                        </h2>

                        <p className="text-muted mb-0">
                            Review important security notifications
                            for your account.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                </div>


                {/* Security Information */}
                <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                        backgroundColor: "#fff7ed",
                        border: "1px solid #fed7aa"
                    }}
                >

                    <h6
                        className="fw-bold mb-2"
                        style={{ color: "#c2410c" }}
                    >
                        Security Monitoring
                    </h6>

                    <p className="text-muted small mb-0">
                        Security alerts are generated when the system
                        detects potentially suspicious activity.
                    </p>

                </div>


                {/* Alerts Card */}
                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h4 className="fw-bold mb-1">
                                    Alert History
                                </h4>

                                <p className="text-muted small mb-0">
                                    Security events requiring your attention.
                                </p>

                            </div>

                            <span className="badge bg-light text-dark border px-3 py-2">
                                {alerts.length} Alerts
                            </span>

                        </div>


                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                />

                                <p className="text-muted mt-3 mb-0">
                                    Loading security alerts...
                                </p>

                            </div>

                        ) : alerts.length === 0 ? (

                            <div
                                className="text-center py-5 rounded-4"
                                style={{
                                    backgroundColor: "#f8fafc"
                                }}
                            >

                                <h5 className="fw-semibold">
                                    No Security Alerts
                                </h5>

                                <p className="text-muted mb-0">
                                    There are currently no security alerts
                                    for your account.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table align-middle mb-0">

                                    <thead>

                                        <tr>

                                            <th>#</th>
                                            <th>Alert</th>
                                            <th>Message</th>
                                            <th>Severity</th>
                                            <th>Status</th>
                                            <th>Created At</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {alerts.map(
                                            (alert, index) => (

                                                <tr key={alert.id}>

                                                    <td className="text-muted">
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <span className="fw-semibold">
                                                            {alert.alertType}
                                                        </span>
                                                    </td>

                                                    <td className="text-muted">
                                                        {alert.message}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className="badge rounded-pill px-3 py-2"
                                                            style={{
                                                                backgroundColor:
                                                                    alert.severity === "HIGH"
                                                                        ? "#fee2e2"
                                                                        : "#fef3c7",
                                                                color:
                                                                    alert.severity === "HIGH"
                                                                        ? "#b91c1c"
                                                                        : "#92400e"
                                                            }}
                                                        >
                                                            {alert.severity}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className="badge rounded-pill px-3 py-2"
                                                            style={{
                                                                backgroundColor:
                                                                    alert.status === "UNREAD"
                                                                        ? "#dbeafe"
                                                                        : "#f1f5f9",
                                                                color:
                                                                    alert.status === "UNREAD"
                                                                        ? "#1d4ed8"
                                                                        : "#475569"
                                                            }}
                                                        >
                                                            {alert.status}
                                                        </span>

                                                    </td>

                                                    <td className="text-muted">
                                                        {formatDateTime(
                                                            alert.createdAt
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </>
    );
}

export default SecurityAlerts;