import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AuditLogs() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {

        try {

            const response = await api.get(
                `/audit-logs?email=${email}`
            );

            setLogs(response.data);

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

    const getActionStyle = (action) => {

        if (action === "SUSPICIOUS_ACTIVITY") {
            return {
                backgroundColor: "#fff7ed",
                color: "#c2410c"
            };
        }

        if (action === "LOGIN_FAILED") {
            return {
                backgroundColor: "#fef2f2",
                color: "#b91c1c"
            };
        }

        if (action === "LOGIN_SUCCESS") {
            return {
                backgroundColor: "#f0fdf4",
                color: "#15803d"
            };
        }

        if (action === "SECURITY_ALERT_CREATED") {
            return {
                backgroundColor: "#eff6ff",
                color: "#1d4ed8"
            };
        }

        return {
            backgroundColor: "#f1f5f9",
            color: "#475569"
        };

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
                            Audit Logs
                        </h2>

                        <p className="text-muted mb-0">
                            Review the history of important security
                            and account activities.
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


                {/* Information */}
                <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0"
                    }}
                >

                    <h6 className="fw-bold mb-2">
                        Activity History
                    </h6>

                    <p className="text-muted small mb-0">
                        Audit logs maintain a record of important
                        activities performed or detected within SecureVault.
                    </p>

                </div>


                {/* Logs Card */}
                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body p-4">

                        {/* Section Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h4 className="fw-bold mb-1">
                                    Recorded Activities
                                </h4>

                                <p className="text-muted small mb-0">
                                    System and security activity history.
                                </p>

                            </div>

                            <span className="badge bg-light text-dark border px-3 py-2">
                                {logs.length} Records
                            </span>

                        </div>


                        {/* Loading */}
                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                />

                                <p className="text-muted mt-3 mb-0">
                                    Loading audit logs...
                                </p>

                            </div>

                        ) : logs.length === 0 ? (

                            /* Empty State */
                            <div
                                className="text-center py-5 rounded-4"
                                style={{
                                    backgroundColor: "#f8fafc"
                                }}
                            >

                                <h5 className="fw-semibold">
                                    No Audit Logs
                                </h5>

                                <p className="text-muted mb-0">
                                    No activities have been recorded yet.
                                </p>

                            </div>

                        ) : (

                            /* Table */
                            <div className="table-responsive">

                                <table className="table align-middle mb-0">

                                    <thead>

                                        <tr>

                                            <th className="text-muted small">
                                                #
                                            </th>

                                            <th className="text-muted small">
                                                ACTION
                                            </th>

                                            <th className="text-muted small">
                                                DESCRIPTION
                                            </th>

                                            <th className="text-muted small">
                                                TIMESTAMP
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {logs.map(
                                            (log, index) => (

                                                <tr key={log.id}>

                                                    <td className="text-muted">
                                                        {index + 1}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className="badge rounded-pill px-3 py-2"
                                                            style={{
                                                                ...getActionStyle(
                                                                    log.action
                                                                ),
                                                                fontWeight: "500"
                                                            }}
                                                        >
                                                            {log.action}
                                                        </span>

                                                    </td>

                                                    <td className="text-muted">
                                                        {log.description}
                                                    </td>

                                                    <td className="text-muted">
                                                        {formatDateTime(
                                                            log.timestamp
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

export default AuditLogs;