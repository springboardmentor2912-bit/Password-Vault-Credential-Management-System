import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username") || "User";

    const [credentials, setCredentials] = useState([]);


    // ==========================================
    // LOAD CREDENTIALS
    // ==========================================

    useEffect(() => {
        loadCredentials();
    }, []);


    const loadCredentials = async () => {

        try {

            const response = await api.get(
                `/credentials?email=${email}`
            );

            setCredentials(response.data);

        } catch (error) {

            console.log(error);

        }

    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const favouriteCount =
        credentials.filter(c => c.favourite).length;

    const categoryCount =
        new Set(credentials.map(c => c.category)).size;


    // ==========================================
    // SECURITY NAVIGATION
    // ==========================================

    const handleSecurityChange = (e) => {

        const value = e.target.value;


        if (value === "login-activities") {

            navigate("/login-activities");

        }


        if (value === "suspicious-activity") {

            navigate("/suspicious-activity");

        }


        if (value === "security-alerts") {

            navigate("/security-alerts");

        }


        if (value === "audit-logs") {

            navigate("/audit-logs");

        }


        if (value === "analytics") {

            navigate("/security-analytics");

        }


        // Security Reports

        if (value === "security-reports") {

            navigate("/security-reports");

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <>

            <Navbar />


            <div
                className="container py-5"
                style={{
                    maxWidth: "1150px"
                }}
            >


                {/* =========================
                    WELCOME
                ========================= */}

                <div className="mb-5">

                    <h2 className="fw-bold mb-2">

                        Welcome, {username}

                    </h2>

                    <p className="text-muted mb-0">

                        Manage your passwords and credentials securely
                        from one place.

                    </p>

                </div>


                {/* =========================
                    STATISTICS
                ========================= */}

                <div className="row g-4 mb-4">


                    {/* TOTAL CREDENTIALS */}

                    <div className="col-md-4">

                        <div
                            className="card h-100 border-0 shadow-sm rounded-4"
                            style={{
                                backgroundColor: "#eef4ff"
                            }}
                        >

                            <div className="card-body p-4">

                                <p className="text-muted mb-2 fw-semibold">

                                    Total Credentials

                                </p>

                                <h1
                                    className="fw-bold mb-0"
                                    style={{
                                        color: "#2563eb"
                                    }}
                                >

                                    {credentials.length}

                                </h1>

                            </div>

                        </div>

                    </div>


                    {/* FAVOURITE */}

                    <div className="col-md-4">

                        <div
                            className="card h-100 border-0 shadow-sm rounded-4"
                            style={{
                                backgroundColor: "#f0fdf4"
                            }}
                        >

                            <div className="card-body p-4">

                                <p className="text-muted mb-2 fw-semibold">

                                    Favourite Credentials

                                </p>

                                <h1
                                    className="fw-bold mb-0"
                                    style={{
                                        color: "#16a34a"
                                    }}
                                >

                                    {favouriteCount}

                                </h1>

                            </div>

                        </div>

                    </div>


                    {/* CATEGORIES */}

                    <div className="col-md-4">

                        <div
                            className="card h-100 border-0 shadow-sm rounded-4"
                            style={{
                                backgroundColor: "#fff7ed"
                            }}
                        >

                            <div className="card-body p-4">

                                <p className="text-muted mb-2 fw-semibold">

                                    Categories

                                </p>

                                <h1
                                    className="fw-bold mb-0"
                                    style={{
                                        color: "#ea580c"
                                    }}
                                >

                                    {categoryCount}

                                </h1>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    BOTTOM SECTION
                ========================= */}

                <div className="row g-4">


                    {/* =========================
                        QUICK ACTIONS
                    ========================= */}

                    <div className="col-lg-5">

                        <div
                            className="card h-100 border-0 shadow-sm rounded-4"
                        >

                            <div className="card-body p-4">


                                <div className="mb-4">

                                    <h4 className="fw-bold mb-1">

                                        Quick Actions

                                    </h4>

                                    <p className="text-muted small mb-0">

                                        Access your credentials and security
                                        information.

                                    </p>

                                </div>


                                <div className="d-grid gap-3">


                                    {/* ADD CREDENTIAL */}

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary text-start py-2"
                                        onClick={() =>
                                            navigate("/add-credential")
                                        }
                                    >

                                        Add Credential

                                    </button>


                                    {/* VIEW CREDENTIALS */}

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary text-start py-2"
                                        onClick={() =>
                                            navigate("/credentials")
                                        }
                                    >

                                        View All Credentials

                                    </button>


                                    {/* =========================
                                        SECURITY
                                    ========================= */}

                                    <div className="mt-2">

                                        <label className="form-label fw-semibold mb-2">

                                            Security

                                        </label>


                                        <select
                                            className="form-select"
                                            defaultValue=""
                                            onChange={handleSecurityChange}
                                        >

                                            <option
                                                value=""
                                                disabled
                                            >

                                                Select security activity

                                            </option>


                                            {/* LOGIN ACTIVITIES */}

                                            <option value="login-activities">

                                                Login Activities

                                            </option>


                                            {/* SUSPICIOUS ACTIVITY */}

                                            <option value="suspicious-activity">

                                                Suspicious Activity

                                            </option>


                                            {/* SECURITY ALERTS */}

                                            <option value="security-alerts">

                                                Security Alerts

                                            </option>


                                            {/* AUDIT LOGS */}

                                            <option value="audit-logs">

                                                Audit Logs

                                            </option>


                                            {/* SECURITY ANALYTICS */}

                                            <option value="analytics">

                                                Security Analytics

                                            </option>


                                            {/* SECURITY REPORTS */}

                                            <option value="security-reports">

                                                Security Reports

                                            </option>


                                        </select>

                                    </div>


                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        RECENT CREDENTIALS
                    ========================= */}

                    <div className="col-lg-7">

                        <div
                            className="card border-0 shadow-sm rounded-4"
                        >

                            <div className="card-body p-4">


                                <div
                                    className="d-flex justify-content-between align-items-center mb-4"
                                >

                                    <div>

                                        <h4 className="fw-bold mb-1">

                                            Recent Credentials

                                        </h4>

                                        <p className="text-muted small mb-0">

                                            Your recently added credentials.

                                        </p>

                                    </div>


                                    {credentials.length > 0 && (

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                navigate("/credentials")
                                            }
                                        >

                                            View All

                                        </button>

                                    )}

                                </div>


                                {/* =========================
                                    NO CREDENTIALS
                                ========================= */}

                                {credentials.length === 0 ? (

                                    <div
                                        className="text-center py-5 rounded-3"
                                        style={{
                                            backgroundColor: "#f8fafc"
                                        }}
                                    >

                                        <h6 className="fw-semibold">

                                            No credentials yet

                                        </h6>


                                        <p className="text-muted small mb-3">

                                            Add your first credential to
                                            get started.

                                        </p>


                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() =>
                                                navigate("/add-credential")
                                            }
                                        >

                                            Add Credential

                                        </button>

                                    </div>

                                ) : (

                                    /* =========================
                                        RECENT CREDENTIALS
                                    ========================= */

                                    credentials
                                        .slice(-5)
                                        .reverse()
                                        .map(c => (

                                            <div
                                                key={c.id}
                                                className="border rounded-3 p-3 mb-3"
                                                style={{
                                                    backgroundColor: "#ffffff"
                                                }}
                                            >

                                                <div
                                                    className="d-flex justify-content-between align-items-center"
                                                >

                                                    <div>

                                                        <h6 className="fw-bold mb-1">

                                                            {c.website}

                                                        </h6>


                                                        <small className="text-muted">

                                                            {c.username}

                                                        </small>

                                                    </div>


                                                    <span
                                                        className="badge rounded-pill"
                                                        style={{
                                                            backgroundColor: "#eff6ff",
                                                            color: "#2563eb",
                                                            fontWeight: "500"
                                                        }}
                                                    >

                                                        {c.category}

                                                    </span>

                                                </div>

                                            </div>

                                        ))

                                )}


                            </div>

                        </div>

                    </div>


                </div>


            </div>

        </>

    );

}


export default Dashboard;