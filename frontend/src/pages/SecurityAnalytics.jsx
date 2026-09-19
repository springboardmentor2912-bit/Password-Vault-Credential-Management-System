import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function SecurityAnalytics() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {

        try {

            const response = await api.get(
                `/security-analytics?email=${email}`
            );

            setAnalytics(response.data);

        } catch (error) {

            console.log(error);

            setError(
                "Unable to load security analytics."
            );

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

    const getSuccessPercentage = () => {

        if (!analytics || analytics.totalLogins === 0) {
            return 0;
        }

        return Math.round(
            (analytics.successfulLogins /
                analytics.totalLogins) * 100
        );

    };

    const getFailedPercentage = () => {

        if (!analytics || analytics.totalLogins === 0) {
            return 0;
        }

        return Math.round(
            (analytics.failedLogins /
                analytics.totalLogins) * 100
        );

    };

    return (

        <>

            <Navbar />

            <div
                className="container py-5"
                style={{ maxWidth: "1200px" }}
            >

                {/* Header */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-2">
                            Security Analytics
                        </h2>

                        <p className="text-muted mb-0">
                            Monitor login activity, suspicious
                            activities, security alerts and recent
                            security events.
                        </p>

                    </div>

                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                </div>


                {/* Loading */}

                {loading && (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="text-muted mt-3">
                            Loading security analytics...
                        </p>

                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}


                {/* Dashboard */}

                {!loading && !error && analytics && (

                    <>

                        {/* Summary Cards */}

                        <div className="row g-4 mb-4">

                            {/* Total Logins */}

                            <div className="col-md-4">

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <p className="text-muted mb-2">
                                            Total Logins
                                        </p>

                                        <h2 className="fw-bold">
                                            {analytics.totalLogins}
                                        </h2>

                                        <small className="text-muted">
                                            All recorded login attempts
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Successful Logins */}

                            <div className="col-md-4">

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <p className="text-muted mb-2">
                                            Successful Logins
                                        </p>

                                        <h2 className="fw-bold text-success">
                                            {analytics.successfulLogins}
                                        </h2>

                                        <small className="text-muted">
                                            {getSuccessPercentage()}% success rate
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Failed Logins */}

                            <div className="col-md-4">

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <p className="text-muted mb-2">
                                            Failed Logins
                                        </p>

                                        <h2 className="fw-bold text-danger">
                                            {analytics.failedLogins}
                                        </h2>

                                        <small className="text-muted">
                                            {getFailedPercentage()}% failure rate
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Suspicious Activities */}

                            <div className="col-md-4">

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <p className="text-muted mb-2">
                                            Suspicious Activities
                                        </p>

                                        <h2 className="fw-bold text-warning">
                                            {analytics.suspiciousActivities}
                                        </h2>

                                        <small className="text-muted">
                                            Detected security activities
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Security Alerts */}

                            <div className="col-md-4">

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <p className="text-muted mb-2">
                                            Security Alerts
                                        </p>

                                        <h2 className="fw-bold text-danger">
                                            {analytics.securityAlerts}
                                        </h2>

                                        <small className="text-muted">
                                            Generated security alerts
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* Audit Logs */}

                            <div className="col-md-4">

                                <div className="card border-0 shadow-sm rounded-4 h-100">

                                    <div className="card-body p-4">

                                        <p className="text-muted mb-2">
                                            Audit Logs
                                        </p>

                                        <h2 className="fw-bold text-primary">
                                            {analytics.auditLogs}
                                        </h2>

                                        <small className="text-muted">
                                            Recorded system activities
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Login Statistics */}

                        <div className="card border-0 shadow-sm rounded-4 mb-4">

                            <div className="card-body p-4">

                                <h4 className="fw-bold mb-1">
                                    Login Statistics
                                </h4>

                                <p className="text-muted small">
                                    Overview of successful and failed login attempts.
                                </p>


                                <div className="mb-3">

                                    <div className="d-flex justify-content-between mb-1">

                                        <span className="fw-semibold">
                                            Successful Logins
                                        </span>

                                        <span>
                                            {analytics.successfulLogins}
                                            {" "}
                                            ({getSuccessPercentage()}%)
                                        </span>

                                    </div>

                                    <div className="progress">

                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{
                                                width:
                                                    `${getSuccessPercentage()}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                <div>

                                    <div className="d-flex justify-content-between mb-1">

                                        <span className="fw-semibold">
                                            Failed Logins
                                        </span>

                                        <span>
                                            {analytics.failedLogins}
                                            {" "}
                                            ({getFailedPercentage()}%)
                                        </span>

                                    </div>

                                    <div className="progress">

                                        <div
                                            className="progress-bar bg-danger"
                                            role="progressbar"
                                            style={{
                                                width:
                                                    `${getFailedPercentage()}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Recent Activities */}

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <div>

                                        <h4 className="fw-bold mb-1">
                                            Recent Security Activity
                                        </h4>

                                        <p className="text-muted small mb-0">
                                            Latest security-related activities recorded by SecureVault.
                                        </p>

                                    </div>

                                    <span className="badge bg-light text-dark border px-3 py-2">
                                        {analytics.recentActivities.length}
                                        {" "}
                                        Activities
                                    </span>

                                </div>


                                {analytics.recentActivities.length === 0 ? (

                                    <div
                                        className="text-center py-5 rounded-4"
                                        style={{
                                            backgroundColor: "#f8fafc"
                                        }}
                                    >

                                        <h5 className="fw-semibold">
                                            No Recent Activity
                                        </h5>

                                        <p className="text-muted mb-0">
                                            No recent security activities were found.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="table-responsive">

                                        <table className="table align-middle mb-0">

                                            <thead>

                                                <tr>

                                                    <th>#</th>

                                                    <th>Activity Type</th>

                                                    <th>Description</th>

                                                    <th>Timestamp</th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {analytics.recentActivities.map(
                                                    (activity, index) => (

                                                        <tr key={index}>

                                                            <td className="text-muted">
                                                                {index + 1}
                                                            </td>

                                                            <td>

                                                                <span className="badge bg-light text-dark border">

                                                                    {activity.type}

                                                                </span>

                                                            </td>

                                                            <td className="text-muted">

                                                                {activity.description}

                                                            </td>

                                                            <td className="text-muted">

                                                                {formatDateTime(
                                                                    activity.timestamp
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

                    </>

                )}

            </div>

        </>

    );

}

export default SecurityAnalytics;