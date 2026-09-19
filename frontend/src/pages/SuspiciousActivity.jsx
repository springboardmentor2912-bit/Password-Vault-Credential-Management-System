import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function SuspiciousActivity() {

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
                `/suspicious-activities?email=${email}`
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
                            Suspicious Activity
                        </h2>

                        <p className="text-muted mb-0">
                            Review activities that have been flagged
                            by the security system.
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
                        backgroundColor: "#fff7ed",
                        border: "1px solid #fed7aa"
                    }}
                >

                    <h6
                        className="fw-bold mb-2"
                        style={{ color: "#c2410c" }}
                    >
                        Suspicious Activity Detection
                    </h6>

                    <p className="text-muted small mb-0">
                        The system flags unusual login behaviour when
                        multiple failed login attempts are detected
                        within a defined time period.
                    </p>

                </div>


                {/* Activity Card */}
                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h4 className="fw-bold mb-1">
                                    Detected Activities
                                </h4>

                                <p className="text-muted small mb-0">
                                    Security events identified by the system.
                                </p>

                            </div>

                            <span className="badge bg-light text-dark border px-3 py-2">
                                {activities.length} Records
                            </span>

                        </div>


                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                />

                                <p className="text-muted mt-3 mb-0">
                                    Loading suspicious activities...
                                </p>

                            </div>

                        ) : activities.length === 0 ? (

                            <div
                                className="text-center py-5 rounded-4"
                                style={{
                                    backgroundColor: "#f8fafc"
                                }}
                            >

                                <h5 className="fw-semibold">
                                    No Suspicious Activity
                                </h5>

                                <p className="text-muted mb-0">
                                    No suspicious activities have been
                                    detected for your account.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table align-middle mb-0">

                                    <thead>

                                        <tr>

                                            <th>#</th>

                                            <th>Activity</th>

                                            <th>Description</th>

                                            <th>Status</th>

                                            <th>Detected At</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {activities.map(
                                            (activity, index) => (

                                                <tr key={activity.id}>

                                                    <td className="text-muted">
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <span className="fw-semibold">
                                                            {activity.activityType}
                                                        </span>
                                                    </td>

                                                    <td className="text-muted">
                                                        {activity.description}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className="badge rounded-pill px-3 py-2"
                                                            style={{
                                                                backgroundColor: "#fee2e2",
                                                                color: "#b91c1c"
                                                            }}
                                                        >
                                                            {activity.status}
                                                        </span>

                                                    </td>

                                                    <td className="text-muted">
                                                        {formatDateTime(
                                                            activity.detectedAt
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

export default SuspiciousActivity;