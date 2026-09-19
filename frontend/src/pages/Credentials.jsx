import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Credentials() {

    const [credentials, setCredentials] = useState([]);
    const [search, setSearch] = useState("");
    const [showFavourite, setShowFavourite] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedCredential, setSelectedCredential] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [permission, setPermission] = useState("VIEW");
    const [sharing, setSharing] = useState(false);

    const email = localStorage.getItem("email");

    useEffect(() => {
        fetchCredentials();
    }, []);

    // ==============================
    // FETCH CREDENTIALS
    // ==============================

    const fetchCredentials = async () => {
        try {

            const response = await api.get(
                `/credentials?email=${email}`
            );

            setCredentials(response.data);

        } catch (error) {

            console.error(
                "Error fetching credentials:",
                error
            );

        }
    };

    // ==============================
    // CHECK PERMISSION
    // ==============================

    const getPermission = (credential) => {

        if (credential.ownerEmail === email) {
            return "FULL";
        }

        return credential.permission || "VIEW";
    };

    const canEdit = (credential) => {

        const userPermission = getPermission(credential);

        return (
            userPermission === "EDIT" ||
            userPermission === "FULL"
        );
    };

    const canDelete = (credential) => {

        return getPermission(credential) === "FULL";
    };

    const canShare = (credential) => {

        return getPermission(credential) === "FULL";
    };

    // ==============================
    // DELETE CREDENTIAL
    // ==============================

    const deleteCredential = async (id) => {

        if (!window.confirm("Are you sure you want to delete this credential?")) {
            return;
        }

        try {

            await api.delete(
                `/credentials/${id}`,
                {
                    params: {
                        email: email
                    }
                }
            );

            alert("Credential deleted successfully");

            fetchCredentials();

        } catch (error) {

            console.error(
                "Delete credential error:",
                error
            );

            const message =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message ||
                      "Delete Failed";

            alert(message);
        }
    };

    // ==============================
    // SHOW / HIDE PASSWORD
    // ==============================

    const togglePassword = (id) => {

        setVisiblePasswords({
            ...visiblePasswords,
            [id]: !visiblePasswords[id]
        });
    };

    // ==============================
    // COPY PASSWORD
    // ==============================

    const copyPassword = async (password) => {

        try {

            await navigator.clipboard.writeText(password);

            alert("Password copied successfully");

        } catch (error) {

            console.error(
                "Copy password error:",
                error
            );

            alert("Unable to copy password");
        }
    };

    // ==============================
    // SHARE MODAL
    // ==============================

    const openShareModal = (credential) => {

        if (!canShare(credential)) {

            alert(
                "You do not have permission to share this credential."
            );

            return;
        }

        setSelectedCredential(credential);
        setRecipientEmail("");
        setPermission("VIEW");
        setShowShareModal(true);
    };

    const closeShareModal = () => {

        if (sharing) {
            return;
        }

        setShowShareModal(false);
        setSelectedCredential(null);
        setRecipientEmail("");
        setPermission("VIEW");
    };

    // ==============================
    // SHARE CREDENTIAL
    // ==============================

    const shareCredential = async () => {

        if (!recipientEmail.trim()) {

            alert("Please enter the recipient email");

            return;
        }

        if (!selectedCredential) {
            return;
        }

        try {

            setSharing(true);

            await api.post(
                `/credential-sharing/${selectedCredential.id}/share`,
                null,
                {
                    params: {
                        ownerEmail: email,
                        recipientEmail: recipientEmail.trim(),
                        permission: permission
                    }
                }
            );

            alert("Credential shared successfully");

            closeShareModal();

        } catch (error) {

            console.error(
                "Share credential error:",
                error
            );

            const message =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message ||
                      error.message ||
                      "Unable to share credential";

            alert(message);

        } finally {

            setSharing(false);
        }
    };

    // ==============================
    // SEARCH + FAVOURITE FILTER
    // ==============================

    const filteredCredentials =
        credentials.filter((credential) => {

            const website =
                credential.website?.toLowerCase() || "";

            const category =
                credential.category?.toLowerCase() || "";

            const searchText =
                search.toLowerCase();

            const matchSearch =
                website.includes(searchText) ||
                category.includes(searchText);

            if (showFavourite) {

                return (
                    matchSearch &&
                    credential.favourite
                );
            }

            return matchSearch;
        });

    // ==============================
    // PERMISSION BADGE
    // ==============================

    const getPermissionStyle = (permissionValue) => {

        if (permissionValue === "VIEW") {
            return {
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe"
            };
        }

        if (permissionValue === "EDIT") {
            return {
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
                border: "1px solid #bbf7d0"
            };
        }

        return {
            backgroundColor: "#fff7ed",
            color: "#ea580c",
            border: "1px solid #fed7aa"
        };
    };

    const getPermissionText = (permissionValue) => {

        if (permissionValue === "VIEW") {
            return "View Only";
        }

        if (permissionValue === "EDIT") {
            return "Edit Access";
        }

        return "Full Management";
    };

    // ==============================
    // UI
    // ==============================

    return (
        <>
            <Navbar />

            <div
                className="container mt-5 mb-5"
                style={{ maxWidth: "1100px" }}
            >

                {/* ============================== */}
                {/* PAGE HEADER */}
                {/* ============================== */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2
                            className="fw-bold mb-1"
                            style={{ color: "#111827" }}
                        >
                            🔐 Saved Credentials
                        </h2>

                        <p
                            className="text-muted mb-0"
                            style={{ fontSize: "15px" }}
                        >
                            Manage your passwords and shared credentials securely.
                        </p>

                    </div>

                    <Link
                        to="/add-credential"
                        className="btn btn-outline-primary px-4 py-2"
                    >
                        ➕ Add Credential
                    </Link>

                </div>

                {/* ============================== */}
                {/* SEARCH CARD */}
                {/* ============================== */}

                <div
                    className="card border-0 shadow-sm rounded-4 mb-4"
                    style={{
                        backgroundColor: "#ffffff"
                    }}
                >

                    <div className="card-body p-4">

                        <div className="row align-items-center">

                            <div className="col-md-8 mb-3 mb-md-0">

                                <label
                                    className="form-label fw-semibold"
                                    style={{ color: "#374151" }}
                                >
                                    Search Credentials
                                </label>

                                <div className="input-group">

                                    <span className="input-group-text bg-white">
                                        🔎
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by website or category..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />

                                </div>

                            </div>

                            <div className="col-md-4">

                                <label
                                    className="form-label fw-semibold"
                                    style={{ color: "#374151" }}
                                >
                                    Filter
                                </label>

                                <button
                                    type="button"
                                    className={`btn w-100 ${
                                        showFavourite
                                            ? "btn-warning"
                                            : "btn-outline-warning"
                                    }`}
                                    onClick={() =>
                                        setShowFavourite(
                                            !showFavourite
                                        )
                                    }
                                >
                                    ⭐ Favourite Only
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ============================== */}
                {/* CREDENTIAL COUNT */}
                {/* ============================== */}

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5
                        className="fw-semibold mb-0"
                        style={{ color: "#374151" }}
                    >
                        {filteredCredentials.length} Credential
                        {filteredCredentials.length !== 1 ? "s" : ""}
                    </h5>

                    {showFavourite && (

                        <span className="badge bg-warning text-dark px-3 py-2">
                            ⭐ Favourite Filter Active
                        </span>

                    )}

                </div>

                {/* ============================== */}
                {/* NO CREDENTIALS */}
                {/* ============================== */}

                {filteredCredentials.length === 0 && (

                    <div
                        className="card border-0 shadow-sm rounded-4 text-center p-5"
                        style={{
                            backgroundColor: "#f8fafc"
                        }}
                    >

                        <div style={{ fontSize: "45px" }}>
                            🔐
                        </div>

                        <h5 className="fw-bold mt-3">
                            No credentials found
                        </h5>

                        <p className="text-muted">
                            Try changing your search or add a new credential.
                        </p>

                        <div>

                            <Link
                                to="/add-credential"
                                className="btn btn-outline-primary px-4"
                            >
                                ➕ Add Credential
                            </Link>

                        </div>

                    </div>

                )}

                {/* ============================== */}
                {/* CREDENTIAL LIST */}
                {/* ============================== */}

                {filteredCredentials.map((credential) => {

                    const userPermission =
                        getPermission(credential);

                    const editAllowed =
                        canEdit(credential);

                    const deleteAllowed =
                        canDelete(credential);

                    const shareAllowed =
                        canShare(credential);

                    return (

                        <div
                            className="card border-0 shadow-sm rounded-4 mb-4"
                            key={credential.id}
                            style={{
                                backgroundColor: "#ffffff",
                                transition: "transform 0.2s ease"
                            }}
                        >

                            <div className="card-body p-4">

                                {/* ============================== */}
                                {/* HEADER */}
                                {/* ============================== */}

                                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">

                                    <div>

                                        <h4
                                            className="fw-bold mb-2"
                                            style={{ color: "#111827" }}
                                        >
                                            🌐 {credential.website}
                                        </h4>

                                        <span
                                            className="badge rounded-pill px-3 py-2"
                                            style={{
                                                backgroundColor: "#f3f4f6",
                                                color: "#4b5563",
                                                border: "1px solid #e5e7eb"
                                            }}
                                        >
                                            {credential.category}
                                        </span>

                                    </div>

                                    <div className="d-flex align-items-center gap-2">

                                        {credential.favourite && (

                                            <span
                                                className="badge rounded-pill px-3 py-2"
                                                style={{
                                                    backgroundColor: "#fff7ed",
                                                    color: "#ea580c",
                                                    border: "1px solid #fed7aa"
                                                }}
                                            >
                                                ⭐ Favourite
                                            </span>

                                        )}

                                        <span
                                            className="badge rounded-pill px-3 py-2"
                                            style={getPermissionStyle(
                                                userPermission
                                            )}
                                        >
                                            {getPermissionText(
                                                userPermission
                                            )}
                                        </span>

                                    </div>

                                </div>

                                <hr
                                    style={{
                                        borderColor: "#e5e7eb"
                                    }}
                                />

                                {/* ============================== */}
                                {/* CREDENTIAL DETAILS */}
                                {/* ============================== */}

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <div
                                            className="p-3 rounded-3"
                                            style={{
                                                backgroundColor: "#f8fafc"
                                            }}
                                        >

                                            <small
                                                className="text-muted d-block mb-1"
                                            >
                                                Username
                                            </small>

                                            <span className="fw-semibold">
                                                👤 {credential.username}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <div
                                            className="p-3 rounded-3"
                                            style={{
                                                backgroundColor: "#f8fafc"
                                            }}
                                        >

                                            <small
                                                className="text-muted d-block mb-1"
                                            >
                                                Password
                                            </small>

                                            <span className="fw-semibold">
                                                {visiblePasswords[
                                                    credential.id
                                                ]
                                                    ? credential.password
                                                    : "••••••••••"}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* ============================== */}
                                {/* ACTION BUTTONS */}
                                {/* ============================== */}

                                <div className="d-flex flex-wrap gap-2 mt-2">

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary px-3"
                                        onClick={() =>
                                            togglePassword(
                                                credential.id
                                            )
                                        }
                                    >
                                        {visiblePasswords[
                                            credential.id
                                        ]
                                            ? "🙈 Hide"
                                            : "👁️ Show"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-info px-3"
                                        onClick={() =>
                                            copyPassword(
                                                credential.password
                                            )
                                        }
                                    >
                                        📋 Copy
                                    </button>

                                    {editAllowed && (

                                        <Link
                                            to={`/update-credential/${credential.id}`}
                                            className="btn btn-sm btn-outline-primary px-3"
                                        >
                                            ✏️ Update
                                        </Link>

                                    )}

                                    {deleteAllowed && (

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger px-3"
                                            onClick={() =>
                                                deleteCredential(
                                                    credential.id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    )}

                                    {shareAllowed && (

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success px-3"
                                            onClick={() =>
                                                openShareModal(
                                                    credential
                                                )
                                            }
                                        >
                                            🔗 Share
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    );
                })}

            </div>

            {/* ================================================= */}
            {/* SHARE CREDENTIAL MODAL */}
            {/* ================================================= */}

            {showShareModal && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor:
                            "rgba(15, 23, 42, 0.35)"
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div
                            className="modal-content border-0 rounded-4 shadow-lg"
                        >

                            {/* MODAL HEADER */}

                            <div className="modal-header px-4 py-3">

                                <div>

                                    <h5 className="modal-title fw-bold">
                                        🔗 Share Credential
                                    </h5>

                                    <small className="text-muted">
                                        Give another registered user access.
                                    </small>

                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeShareModal}
                                ></button>

                            </div>

                            {/* MODAL BODY */}

                            <div className="modal-body px-4">

                                <div
                                    className="p-3 rounded-3 mb-4"
                                    style={{
                                        backgroundColor: "#f8fafc",
                                        border: "1px solid #e5e7eb"
                                    }}
                                >

                                    <small className="text-muted">
                                        Credential
                                    </small>

                                    <div className="fw-bold mt-1">
                                        🌐 {selectedCredential?.website}
                                    </div>

                                </div>

                                {/* EMAIL */}

                                <label
                                    className="form-label fw-semibold"
                                >
                                    Recipient Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter recipient email"
                                    value={recipientEmail}
                                    onChange={(e) =>
                                        setRecipientEmail(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="email"
                                />

                                <small className="text-muted">
                                    The recipient must already be registered
                                    in SecureVault.
                                </small>

                                {/* PERMISSION */}

                                <div className="mt-4">

                                    <label
                                        className="form-label fw-semibold"
                                    >
                                        Access Permission
                                    </label>

                                    <select
                                        className="form-select"
                                        value={permission}
                                        onChange={(e) =>
                                            setPermission(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="VIEW">
                                            View Only
                                        </option>

                                        <option value="EDIT">
                                            Edit Access
                                        </option>

                                        <option value="FULL">
                                            Full Management
                                        </option>

                                    </select>

                                </div>

                                {/* PERMISSION DESCRIPTION */}

                                <div
                                    className="mt-3 p-3 rounded-3"
                                    style={{
                                        backgroundColor:
                                            permission === "VIEW"
                                                ? "#eff6ff"
                                                : permission === "EDIT"
                                                ? "#f0fdf4"
                                                : "#fff7ed"
                                    }}
                                >

                                    <strong>
                                        {permission === "VIEW"
                                            ? "👁️ View Only"
                                            : permission === "EDIT"
                                            ? "✏️ Edit Access"
                                            : "🛡️ Full Management"}
                                    </strong>

                                    <p className="mb-0 mt-1 small text-muted">

                                        {permission === "VIEW"
                                            ? "The user can view the credential but cannot modify or delete it."
                                            : permission === "EDIT"
                                            ? "The user can view and edit the credential."
                                            : "The user can view, edit, delete, and manage sharing for the credential."}

                                    </p>

                                </div>

                            </div>

                            {/* MODAL FOOTER */}

                            <div className="modal-footer px-4 py-3">

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4"
                                    onClick={closeShareModal}
                                    disabled={sharing}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-success px-4"
                                    onClick={shareCredential}
                                    disabled={sharing}
                                >
                                    {sharing
                                        ? "Sharing..."
                                        : "🔗 Share Credential"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}

export default Credentials;