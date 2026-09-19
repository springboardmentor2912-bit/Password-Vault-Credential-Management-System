import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function SecurityReports() {

    const email = localStorage.getItem("email");

    const [passwordHealth, setPasswordHealth] = useState(null);
    const [loginReport, setLoginReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadReports = async () => {

            try {

                const passwordResponse =
                    await api.get(
                        `/reports/password-health?email=${email}`
                    );

                const loginResponse =
                    await api.get(
                        `/reports/login-activity?email=${email}`
                    );

                setPasswordHealth(
                    passwordResponse.data
                );

                setLoginReport(
                    loginResponse.data
                );

            }
            catch (error) {

                console.error(
                    "Unable to load reports:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadReports();

    }, [email]);


    if (loading) {

        return (

            <>
                <Navbar />

                <div
                    className="container text-center"
                    style={{ marginTop: "100px" }}
                >
                    <h4 className="text-secondary">
                        Loading Security Reports...
                    </h4>
                </div>

            </>

        );

    }


    if (!passwordHealth || !loginReport) {

        return (

            <>
                <Navbar />

                <div
                    className="container text-center"
                    style={{ marginTop: "100px" }}
                >
                    <h4 className="text-secondary">
                        Unable to load security reports.
                    </h4>
                </div>

            </>

        );

    }


    return (

        <>

            <Navbar />


            {/* ================================
                MAIN CONTAINER
            ================================= */}

            <div
                className="container"
                style={{
                    maxWidth: "1320px",
                    paddingTop: "32px",
                    paddingBottom: "60px"
                }}
            >


                {/* ================================
                    HEADER
                ================================= */}

                <div
                    className="d-flex justify-content-between align-items-center mb-4"
                >

                    <div>

                        <h1
                            className="fw-bold mb-1"
                            style={{
                                color: "#263238",
                                fontSize: "32px"
                            }}
                        >
                            🔐 Security Reports
                        </h1>

                        <p
                            className="mb-0"
                            style={{
                                color: "#6c757d",
                                fontSize: "15px"
                            }}
                        >
                            Analyze your password health and login activity.
                        </p>

                    </div>


                    <button
                        className="btn"
                        onClick={() =>
                            window.location.href = "/dashboard"
                        }
                        style={{
                            border: "1px solid #7a9cc6",
                            color: "#486581",
                            backgroundColor: "#ffffff",
                            borderRadius: "7px",
                            padding: "9px 18px"
                        }}
                    >
                        Dashboard
                    </button>

                </div>



                {/* ==================================================
                    PASSWORD HEALTH SECTION
                =================================================== */}

                <div
                    className="card shadow-sm mb-4"
                    style={{
                        border: "1px solid #d9dee3",
                        borderRadius: "16px",
                        backgroundColor: "#ffffff"
                    }}
                >

                    <div className="card-body p-4">


                        <h2
                            className="fw-bold mb-4"
                            style={{
                                color: "#263238",
                                fontSize: "24px"
                            }}
                        >
                            🔑 Password Health
                        </h2>


                        {/* ================================
                            PASSWORD CARDS
                        ================================= */}

                        <div className="row g-3 mb-4">


                            {/* TOTAL */}

                            <div className="col-md-3">

                                <div
                                    className="p-3 h-100"
                                    style={{
                                        backgroundColor: "#f5f6f7",
                                        borderRadius: "9px",
                                        border: "1px solid #e1e4e7"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#6c757d",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Total Credentials
                                    </div>

                                    <div
                                        className="fw-bold mt-1"
                                        style={{
                                            fontSize: "32px",
                                            color: "#263238"
                                        }}
                                    >
                                        {passwordHealth.totalCredentials}
                                    </div>

                                </div>

                            </div>


                            {/* STRONG */}

                            <div className="col-md-3">

                                <div
                                    className="p-3 h-100"
                                    style={{
                                        backgroundColor: "#f1f7f4",
                                        borderRadius: "9px",
                                        border: "1px solid #9bc7b0"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#4c8067",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Strong Passwords
                                    </div>

                                    <div
                                        className="fw-bold mt-1"
                                        style={{
                                            fontSize: "32px",
                                            color: "#34785a"
                                        }}
                                    >
                                        {passwordHealth.strongPasswords}
                                    </div>

                                    <small
                                        style={{
                                            color: "#6c757d"
                                        }}
                                    >
                                        {passwordHealth.strongPercentage}%
                                    </small>

                                </div>

                            </div>


                            {/* MEDIUM */}

                            <div className="col-md-3">

                                <div
                                    className="p-3 h-100"
                                    style={{
                                        backgroundColor: "#fbf7ed",
                                        borderRadius: "9px",
                                        border: "1px solid #dec98f"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#987b25",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Medium Passwords
                                    </div>

                                    <div
                                        className="fw-bold mt-1"
                                        style={{
                                            fontSize: "32px",
                                            color: "#a88725"
                                        }}
                                    >
                                        {passwordHealth.mediumPasswords}
                                    </div>

                                    <small
                                        style={{
                                            color: "#6c757d"
                                        }}
                                    >
                                        {passwordHealth.mediumPercentage}%
                                    </small>

                                </div>

                            </div>


                            {/* WEAK */}

                            <div className="col-md-3">

                                <div
                                    className="p-3 h-100"
                                    style={{
                                        backgroundColor: "#faf2f3",
                                        borderRadius: "9px",
                                        border: "1px solid #d9a5ab"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#9b5961",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Weak Passwords
                                    </div>

                                    <div
                                        className="fw-bold mt-1"
                                        style={{
                                            fontSize: "32px",
                                            color: "#a34f59"
                                        }}
                                    >
                                        {passwordHealth.weakPasswords}
                                    </div>

                                    <small
                                        style={{
                                            color: "#6c757d"
                                        }}
                                    >
                                        {passwordHealth.weakPercentage}%
                                    </small>

                                </div>

                            </div>

                        </div>



                        {/* ================================
                            PASSWORD DISTRIBUTION
                        ================================= */}

                        <h5
                            className="fw-bold mb-3"
                            style={{
                                color: "#37474f"
                            }}
                        >
                            Password Strength Distribution
                        </h5>


                        {/* STRONG */}

                        <div className="mb-3">

                            <div className="d-flex justify-content-between">

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    Strong
                                </span>

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    {passwordHealth.strongPercentage}%
                                </span>

                            </div>

                            <div
                                className="progress"
                                style={{
                                    height: "15px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "8px"
                                }}
                            >

                                <div
                                    className="progress-bar"
                                    style={{
                                        width:
                                            `${passwordHealth.strongPercentage}%`,
                                        backgroundColor: "#4f8a6d"
                                    }}
                                />

                            </div>

                        </div>


                        {/* MEDIUM */}

                        <div className="mb-3">

                            <div className="d-flex justify-content-between">

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    Medium
                                </span>

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    {passwordHealth.mediumPercentage}%
                                </span>

                            </div>

                            <div
                                className="progress"
                                style={{
                                    height: "15px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "8px"
                                }}
                            >

                                <div
                                    className="progress-bar"
                                    style={{
                                        width:
                                            `${passwordHealth.mediumPercentage}%`,
                                        backgroundColor: "#c19a32"
                                    }}
                                />

                            </div>

                        </div>


                        {/* WEAK */}

                        <div className="mb-4">

                            <div className="d-flex justify-content-between">

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    Weak
                                </span>

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    {passwordHealth.weakPercentage}%
                                </span>

                            </div>

                            <div
                                className="progress"
                                style={{
                                    height: "15px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "8px"
                                }}
                            >

                                <div
                                    className="progress-bar"
                                    style={{
                                        width:
                                            `${passwordHealth.weakPercentage}%`,
                                        backgroundColor: "#a85a63"
                                    }}
                                />

                            </div>

                        </div>



                        {/* ================================
                            HEALTH SCORE
                        ================================= */}

                        <div
                            className="p-3"
                            style={{
                                backgroundColor: "#eef4fb",
                                border: "1px solid #b7cbe3",
                                borderRadius: "7px"
                            }}
                        >

                            <div
                                className="d-flex justify-content-between align-items-center"
                            >

                                <div>

                                    <strong
                                        style={{
                                            color: "#345477",
                                            fontSize: "16px"
                                        }}
                                    >
                                        Overall Password Health Score
                                    </strong>

                                    <div
                                        style={{
                                            color: "#66788a",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Based on the strength of your stored
                                        passwords.
                                    </div>

                                </div>


                                <div
                                    className="fw-bold"
                                    style={{
                                        color: "#345477",
                                        fontSize: "32px"
                                    }}
                                >
                                    {passwordHealth.healthScore}%
                                </div>

                            </div>

                        </div>

                    </div>

                </div>



                {/* ==================================================
                    LOGIN ACTIVITY SECTION
                =================================================== */}

                <div
                    className="card shadow-sm"
                    style={{
                        border: "1px solid #d9dee3",
                        borderRadius: "16px",
                        backgroundColor: "#ffffff"
                    }}
                >

                    <div className="card-body p-4">


                        <h2
                            className="fw-bold mb-4"
                            style={{
                                color: "#263238",
                                fontSize: "24px"
                            }}
                        >
                            🛡️ Login Activity Report
                        </h2>



                        {/* ================================
                            LOGIN CARDS
                        ================================= */}

                        <div className="row g-3 mb-4">


                            {/* TOTAL */}

                            <div className="col-md-4">

                                <div
                                    className="p-3 h-100"
                                    style={{
                                        backgroundColor: "#f5f6f7",
                                        borderRadius: "9px",
                                        border: "1px solid #e1e4e7"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#6c757d"
                                        }}
                                    >
                                        Total Login Attempts
                                    </div>

                                    <div
                                        className="fw-bold mt-1"
                                        style={{
                                            fontSize: "32px",
                                            color: "#263238"
                                        }}
                                    >
                                        {loginReport.totalAttempts}
                                    </div>

                                </div>

                            </div>


                            {/* SUCCESS */}

                            <div className="col-md-4">

                                <div
                                    className="p-3 h-100"
                                    style={{
                                        backgroundColor: "#f1f7f4",
                                        borderRadius: "9px",
                                        border: "1px solid #9bc7b0"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#4c8067"
                                        }}
                                    >
                                        Successful Logins
                                    </div>

                                    <div
                                        className="fw-bold mt-1"
                                        style={{
                                            fontSize: "32px",
                                            color: "#34785a"
                                        }}
                                    >
                                        {loginReport.successfulLogins}
                                    </div>

                                    <small
                                        style={{
                                            color: "#6c757d"
                                        }}
                                    >
                                        {loginReport.successfulPercentage}%
                                    </small>

                                </div>

                            </div>


                            {/* FAILED */}

                            <div className="col-md-4">

                                <div
                                    className="p-3 h-100"
                                    style={{
                                        backgroundColor: "#faf2f3",
                                        borderRadius: "9px",
                                        border: "1px solid #d9a5ab"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#9b5961"
                                        }}
                                    >
                                        Failed Logins
                                    </div>

                                    <div
                                        className="fw-bold mt-1"
                                        style={{
                                            fontSize: "32px",
                                            color: "#a34f59"
                                        }}
                                    >
                                        {loginReport.failedLogins}
                                    </div>

                                    <small
                                        style={{
                                            color: "#6c757d"
                                        }}
                                    >
                                        {loginReport.failedPercentage}%
                                    </small>

                                </div>

                            </div>

                        </div>



                        {/* ================================
                            LOGIN DISTRIBUTION
                        ================================= */}

                        <h5
                            className="fw-bold mb-3"
                            style={{
                                color: "#37474f"
                            }}
                        >
                            Login Activity Distribution
                        </h5>


                        {/* SUCCESS BAR */}

                        <div className="mb-3">

                            <div className="d-flex justify-content-between">

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    Successful
                                </span>

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    {loginReport.successfulPercentage}%
                                </span>

                            </div>

                            <div
                                className="progress"
                                style={{
                                    height: "15px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "8px"
                                }}
                            >

                                <div
                                    className="progress-bar"
                                    style={{
                                        width:
                                            `${loginReport.successfulPercentage}%`,
                                        backgroundColor: "#4f8a6d"
                                    }}
                                />

                            </div>

                        </div>


                        {/* FAILED BAR */}

                        <div className="mb-4">

                            <div className="d-flex justify-content-between">

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    Failed
                                </span>

                                <span
                                    style={{
                                        color: "#455a64"
                                    }}
                                >
                                    {loginReport.failedPercentage}%
                                </span>

                            </div>

                            <div
                                className="progress"
                                style={{
                                    height: "15px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "8px"
                                }}
                            >

                                <div
                                    className="progress-bar"
                                    style={{
                                        width:
                                            `${loginReport.failedPercentage}%`,
                                        backgroundColor: "#a85a63"
                                    }}
                                />

                            </div>

                        </div>



                        {/* ================================
                            RECENT ACTIVITIES
                        ================================= */}

                        <h5
                            className="fw-bold mb-3"
                            style={{
                                color: "#37474f"
                            }}
                        >
                            🕘 Recent Login Activities
                        </h5>


                        <div
                            className="table-responsive"
                        >

                            <table
                                className="table align-middle"
                                style={{
                                    marginBottom: 0
                                }}
                            >

                                <thead>

                                    <tr
                                        style={{
                                            borderBottom:
                                                "1px solid #d9dee3"
                                        }}
                                    >

                                        <th
                                            style={{
                                                color: "#37474f"
                                            }}
                                        >
                                            ID
                                        </th>

                                        <th
                                            style={{
                                                color: "#37474f"
                                            }}
                                        >
                                            Email
                                        </th>

                                        <th
                                            style={{
                                                color: "#37474f"
                                            }}
                                        >
                                            Status
                                        </th>

                                        <th
                                            style={{
                                                color: "#37474f"
                                            }}
                                        >
                                            Timestamp
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loginReport.recentActivities &&
                                        loginReport.recentActivities.map(
                                            (activity) => (

                                                <tr
                                                    key={activity.id}
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e5e7e9"
                                                    }}
                                                >

                                                    <td>
                                                        {activity.id}
                                                    </td>

                                                    <td
                                                        style={{
                                                            color: "#455a64"
                                                        }}
                                                    >
                                                        {activity.email}
                                                    </td>

                                                    <td>

                                                        {activity.status
                                                            .toUpperCase() ===
                                                            "SUCCESS" ? (

                                                            <span
                                                                className="badge"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#dcefe5",
                                                                    color:
                                                                        "#34785a",
                                                                    fontWeight:
                                                                        "600",
                                                                    padding:
                                                                        "6px 10px"
                                                                }}
                                                            >
                                                                SUCCESS
                                                            </span>

                                                        ) : (

                                                            <span
                                                                className="badge"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#f2dfe2",
                                                                    color:
                                                                        "#9b4f59",
                                                                    fontWeight:
                                                                        "600",
                                                                    padding:
                                                                        "6px 10px"
                                                                }}
                                                            >
                                                                FAILED
                                                            </span>

                                                        )}

                                                    </td>

                                                    <td
                                                        style={{
                                                            color: "#60717d"
                                                        }}
                                                    >
                                                        {new Date(
                                                            activity.timestamp
                                                        ).toLocaleString()}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}

export default SecurityReports;