import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function LoginActivities() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {

        try {

            const response = await api.get(
                `/login-activities?email=${email}`
            );

            setActivities(response.data);

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
                minute: "2-digit",
                second: "2-digit"
            }
        );

    };

    const successCount = activities.filter(
        activity => activity.status === "SUCCESS"
    ).length;

    const failedCount = activities.filter(
        activity => activity.status === "FAILED"
    ).length;

    return (

        <>

            <Navbar />

            <div
                className="container py-5"
                style={{ maxWidth: "1150px" }}
            >

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-5">

                    <div>

                        <h2 className="fw-bold mb-2">
                            🔐 Login Activities
                        </h2>

                        <p className="text-muted mb-0">
                            Monitor and review your account login activity.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-primary px-4"
                        onClick={() => navigate("/dashboard")}
                    >
                        🏠 Dashboard
                    </button>

                </div>


                {/* Security Information */}
                <div
                    className="card border-0 rounded-4 mb-4"
                    style={{
                        backgroundColor: "#eef4ff"
                    }}
                >

                    <div className="card-body p-4">

                        <div className="d-flex align-items-start">

                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "#dbeafe",
                                    fontSize: "21px"
                                }}
                            >
                                🛡️
                            </div>

                            <div>

                                <h5
                                    className="fw-bold mb-1"
                                    style={{
                                        color: "#1e40af"
                                    }}
                                >
                                    Security Monitoring
                                </h5>

                                <p
                                    className="mb-0 small"
                                    style={{
                                        color: "#475569"
                                    }}
                                >
                                    Every login attempt is securely recorded
                                    with its status, email, and timestamp.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Summary Cards */}
                <div className="row g-4 mb-4">

                    {/* Total */}
                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm rounded-4 h-100"
                            style={{
                                backgroundColor: "#f8fafc"
                            }}
                        >

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <p className="text-muted mb-1">
                                            Total Attempts
                                        </p>

                                        <h2 className="fw-bold mb-0">
                                            {activities.length}
                                        </h2>

                                    </div>

                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            backgroundColor: "#e2e8f0",
                                            fontSize: "21px"
                                        }}
                                    >
                                        📊
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Successful */}
                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm rounded-4 h-100"
                            style={{
                                backgroundColor: "#f0fdf4"
                            }}
                        >

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <p className="text-muted mb-1">
                                            Successful Logins
                                        </p>

                                        <h2
                                            className="fw-bold mb-0"
                                            style={{
                                                color: "#16a34a"
                                            }}
                                        >
                                            {successCount}
                                        </h2>

                                    </div>

                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            backgroundColor: "#dcfce7",
                                            fontSize: "21px"
                                        }}
                                    >
                                        ✅
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Failed */}
                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm rounded-4 h-100"
                            style={{
                                backgroundColor: "#fff7f7"
                            }}
                        >

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <p className="text-muted mb-1">
                                            Failed Attempts
                                        </p>

                                        <h2
                                            className="fw-bold mb-0"
                                            style={{
                                                color: "#dc2626"
                                            }}
                                        >
                                            {failedCount}
                                        </h2>

                                    </div>

                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            backgroundColor: "#fee2e2",
                                            fontSize: "21px"
                                        }}
                                    >
                                        ⚠️
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Login History */}
                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h4 className="fw-bold mb-1">
                                    Login History
                                </h4>

                                <p className="text-muted small mb-0">
                                    Recent login attempts for your account.
                                </p>

                            </div>

                            <span
                                className="badge rounded-pill px-3 py-2"
                                style={{
                                    backgroundColor: "#eff6ff",
                                    color: "#2563eb"
                                }}
                            >
                                {activities.length} Attempts
                            </span>

                        </div>


                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                >
                                </div>

                                <p className="text-muted mt-3 mb-0">
                                    Loading login activities...
                                </p>

                            </div>

                        ) : activities.length === 0 ? (

                            <div
                                className="text-center py-5 rounded-4"
                                style={{
                                    backgroundColor: "#f8fafc"
                                }}
                            >

                                <div style={{ fontSize: "45px" }}>
                                    🔐
                                </div>

                                <h5 className="fw-semibold mt-3">
                                    No Login Activities
                                </h5>

                                <p className="text-muted mb-0">
                                    Your login activity will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table
                                    className="table align-middle mb-0"
                                >

                                    <thead>

                                        <tr
                                            style={{
                                                borderBottom:
                                                    "1px solid #e2e8f0"
                                            }}
                                        >

                                            <th
                                                className="text-muted small fw-semibold py-3"
                                            >
                                                #
                                            </th>

                                            <th
                                                className="text-muted small fw-semibold py-3"
                                            >
                                                EMAIL
                                            </th>

                                            <th
                                                className="text-muted small fw-semibold py-3"
                                            >
                                                STATUS
                                            </th>

                                            <th
                                                className="text-muted small fw-semibold py-3"
                                            >
                                                DATE & TIME
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {activities.map(
                                            (activity, index) => (

                                                <tr key={activity.id}>

                                                    <td
                                                        className="text-muted py-3"
                                                    >
                                                        {index + 1}
                                                    </td>

                                                    <td className="py-3">

                                                        <div className="d-flex align-items-center">

                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: "38px",
                                                                    height: "38px",
                                                                    backgroundColor: "#f1f5f9"
                                                                }}
                                                            >
                                                                📧
                                                            </div>

                                                            <div>

                                                                <div className="fw-semibold">
                                                                    {activity.email}
                                                                </div>

                                                                <small className="text-muted">
                                                                    Account login
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td className="py-3">

                                                        {activity.status === "SUCCESS" ? (

                                                            <span
                                                                className="badge rounded-pill px-3 py-2"
                                                                style={{
                                                                    backgroundColor: "#dcfce7",
                                                                    color: "#15803d"
                                                                }}
                                                            >
                                                                ✓ SUCCESS
                                                            </span>

                                                        ) : (

                                                            <span
                                                                className="badge rounded-pill px-3 py-2"
                                                                style={{
                                                                    backgroundColor: "#fee2e2",
                                                                    color: "#dc2626"
                                                                }}
                                                            >
                                                                ✕ FAILED
                                                            </span>

                                                        )}

                                                    </td>

                                                    <td className="py-3">

                                                        <div className="d-flex align-items-center">

                                                            <span className="me-2">
                                                                🕒
                                                            </span>

                                                            <span className="text-muted">
                                                                {formatDateTime(
                                                                    activity.timestamp
                                                                )}
                                                            </span>

                                                        </div>

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


                {/* Security Note */}
                <div
                    className="text-center mt-4"
                >

                    <small className="text-muted">
                        🔒 Login activity is recorded automatically
                        for security monitoring.
                    </small>

                </div>

            </div>

        </>
    );
}

export default LoginActivities;