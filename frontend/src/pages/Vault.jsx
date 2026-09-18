import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getVaultEntries,
  getSharedVaultEntries,
  addVaultEntry,
  updateVaultEntry,
  deleteVaultEntry,
  shareVaultEntry,
} from "../services/api";
import "./Vault.css";

function Vault({ initialPage = "home" }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  const [page, setPage] = useState(initialPage);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showShareForm, setShowShareForm] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("VIEW");
  const [shareExpiryDate, setShareExpiryDate] = useState("");

  const [form, setForm] = useState({
    website: "",
    username: "",
    password: "",
    notes: "",
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const myResponse = await getVaultEntries();

      const myEntries = Array.isArray(myResponse.data)
        ? myResponse.data.map((entry) => ({
            ...entry,
            isShared: false,
            permission: "OWNER",
          }))
        : [];

      let sharedEntries = [];

      try {
        const sharedResponse = await getSharedVaultEntries();

        if (Array.isArray(sharedResponse.data)) {
          sharedEntries = sharedResponse.data.map((entry) => ({
            ...entry,
            isShared: true,
            permission: entry.permission || "VIEW",
          }));
        }
      } catch (error) {
        console.error(
          "Error loading shared credentials:",
          error
        );
      }

      setEntries([...myEntries, ...sharedEntries]);
    } catch (error) {
      console.error(
        "Error loading vault entries:",
        error
      );

      setEntries([]);
    }
  };

  const resetForm = () => {
    setForm({
      website: "",
      username: "",
      password: "",
      notes: "",
    });

    setEditingId(null);
    setPasswordStrength("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateVaultEntry(editingId, form);
        alert("Credential updated successfully!");
      } else {
        await addVaultEntry(form);
        alert("Credential added successfully!");
      }

      resetForm();

      await loadEntries();

      setPage("credentials");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Operation failed"
        );
      } else {
        alert("Server error");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this credential?"
    );

    if (!confirmDelete) return;

    try {
      await deleteVaultEntry(id);

      alert("Credential deleted successfully");

      setSelectedEntry(null);

      await loadEntries();

      setPage("credentials");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Delete failed"
        );
      } else {
        alert("Server error");
      }
    }
  };

  const openAddPage = () => {
    resetForm();
    setPage("add");
  };

  const openCredential = (entry) => {
    setSelectedEntry(entry);
    setVisiblePassword(false);
    setPage("details");
  };

  const openEdit = (entry) => {
    if (
      entry.isShared &&
      entry.permission !== "EDIT"
    ) {
      alert(
        "You only have VIEW permission for this credential."
      );
      return;
    }

    setSelectedEntry(entry);

    setEditingId(entry.id);

    setForm({
      website: entry.website || "",
      username: entry.username || "",
      password: entry.password || "",
      notes: entry.notes || "",
    });

    setPasswordStrength("");

    setPage("edit");
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const score =
      Number(hasUppercase) +
      Number(hasLowercase) +
      Number(hasNumber) +
      Number(hasSpecial);

    if (
      password.length >= 8 &&
      score === 4
    ) {
      setPasswordStrength("Strong");
    } else if (score >= 2) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const generatePassword = () => {
    const uppercase =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const lowercase =
      "abcdefghijklmnopqrstuvwxyz";

    const numbers =
      "0123456789";

    const symbols =
      "!@#$%^&*()_+-=[]{}<>?";

    const allCharacters =
      uppercase +
      lowercase +
      numbers +
      symbols;

    let password = "";

    for (let i = 0; i < 12; i++) {
      password += allCharacters.charAt(
        Math.floor(
          Math.random() *
            allCharacters.length
        )
      );
    }

    setForm({
      ...form,
      password,
    });

    checkPasswordStrength(password);
  };

  const copyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(
        password
      );

      alert(
        "Copied successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to copy."
      );
    }
  };

  const openShare = (entry) => {
    setSelectedEntry(entry);

    setShareEmail("");

    setSharePermission("VIEW");

    setShareExpiryDate("");

    setShowShareForm(true);
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      alert(
        "Please enter the user's email."
      );

      return;
    }

    if (!selectedEntry) {
      alert(
        "No credential selected."
      );

      return;
    }

    try {
      await shareVaultEntry(
        selectedEntry.id,
        shareEmail.trim(),
        sharePermission,
        shareExpiryDate || null
      );

      alert(
        `Credential shared successfully with ${shareEmail.trim()}`
      );

      setShowShareForm(false);

      setShareEmail("");

      setSharePermission("VIEW");

      setShareExpiryDate("");

      await loadEntries();
    } catch (error) {
      console.error(
        "Share error:",
        error
      );

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Failed to share credential."
        );
      } else {
        alert(
          "Server error."
        );
      }
    }
  };

  const filteredEntries =
    entries.filter((entry) =>
      (entry.website || "")
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  const goBack = () => {
  if (page === "details") {
    setPage("credentials");
    setSelectedEntry(null);
    return;
  }

  if (page === "edit") {
    setPage("credentials");
    setEditingId(null);
    return;
  }

  navigate("/dashboard");
};

  return (
    <div className="vault-container">

      {/* HOME */}

      {page === "home" && (
        <>
          <div className="vault-topbar">
            <h1>Secure Vault</h1>
          </div>

          <div className="vault-welcome">
            <h2>Welcome</h2>

            <p>
              Manage your credentials securely
              in one place.
            </p>
          </div>

          <div className="vault-main-actions">

            <button
              className="vault-action-card"
              onClick={openAddPage}
            >
              <span className="action-title">
                + Add Credential
              </span>

              <span className="action-description">
                Save a new credential securely
              </span>
            </button>

            <button
              className="vault-action-card"
              onClick={() =>
                setPage("credentials")
              }
            >
              <span className="action-title">
                View Credentials
              </span>

              <span className="action-description">
                View and manage your saved
                credentials
              </span>
            </button>

          </div>

          <button
            className="back-btn"
            onClick={() =>
              window.history.back()
            }
          >
            Back
          </button>
        </>
      )}

      {/* ADD */}

      {page === "add" && (
        <div className="vault-inner-page">

          <button
            className="back-btn"
            onClick={goBack}
          >
            Back
          </button>

          <div className="vault-form-card">

            <h2>
              Add Credential
            </h2>

            <p className="form-subtitle">
              Save your credential securely.
            </p>

            <form
              onSubmit={handleSubmit}
            >

              <label>
                Website
              </label>

              <input
                type="text"
                name="website"
                placeholder="Example: Gmail"
                value={form.website}
                onChange={handleChange}
                required
              />

              <label>
                Username
              </label>

              <input
                type="text"
                name="username"
                placeholder="Username or email"
                value={form.username}
                onChange={handleChange}
                required
              />

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => {
                  handleChange(e);
                  checkPasswordStrength(
                    e.target.value
                  );
                }}
                required
              />

              <button
                type="button"
                className="generate-btn"
                onClick={generatePassword}
              >
                Generate Password
              </button>

              {passwordStrength && (
                <p
                  className={`password-strength ${passwordStrength.toLowerCase()}`}
                >
                  Password Strength:{" "}
                  {passwordStrength}
                </p>
              )}

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                placeholder="Optional notes"
                value={form.notes}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="primary-btn"
              >
                Save Credential
              </button>

            </form>

          </div>
        </div>
      )}

      {/* EDIT */}

      {page === "edit" && (
        <div className="vault-inner-page">

          <button
            className="back-btn"
            onClick={goBack}
          >
            Back
          </button>

          <div className="vault-form-card">

            <h2>
              Edit Credential
            </h2>

            <p className="form-subtitle">
              Update your credential details.
            </p>

            <form
              onSubmit={handleSubmit}
            >

              <label>
                Website
              </label>

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                required
              />

              <label>
                Username
              </label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => {
                  handleChange(e);
                  checkPasswordStrength(
                    e.target.value
                  );
                }}
                required
              />

              {passwordStrength && (
                <p
                  className={`password-strength ${passwordStrength.toLowerCase()}`}
                >
                  Password Strength:{" "}
                  {passwordStrength}
                </p>
              )}

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="primary-btn"
              >
                Update Credential
              </button>

            </form>

          </div>
        </div>
      )}

      {/* CREDENTIAL LIST */}

      {page === "credentials" && (
        <div className="vault-inner-page">

          <button
            className="back-btn"
            onClick={goBack}
          >
            Back
          </button>

          <div className="credentials-header">

            <div>
              <h2>
                Saved Credentials
              </h2>

              <p>
                View your saved and shared
                credentials.
              </p>
            </div>

            <button
              className="add-small-btn"
              onClick={openAddPage}
            >
              + Add Credential
            </button>

          </div>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search by website..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          <div className="credential-list">

            {filteredEntries.length === 0 ? (

              <div className="empty-state">
                No credentials found.
              </div>

            ) : (

              filteredEntries.map(
                (entry) => (

                  <div
                    className="credential-row"
                    key={`${entry.isShared ? "shared" : "own"}-${entry.id}`}
                  >

                    <div className="credential-info">

                      <div className="credential-name">
                        {entry.website}
                      </div>

                      <div className="credential-username">
                        {entry.username}
                      </div>

                      {entry.isShared && (
                        <span className="shared-badge">
                          Shared ·{" "}
                          {entry.permission}
                        </span>
                      )}

                    </div>

                    <button
                      className="view-btn"
                      onClick={() =>
                        openCredential(
                          entry
                        )
                      }
                    >
                      View
                    </button>

                  </div>

                )
              )

            )}

          </div>

        </div>
      )}

      {/* DETAILS */}

      {page === "details" &&
        selectedEntry && (
          <div className="vault-inner-page">

            <button
              className="back-btn"
              onClick={goBack}
            >
              Back
            </button>

            <div className="credential-details-card">

              <div className="details-header">

                <div>

                  <h2>
                    {selectedEntry.website}
                  </h2>

                  {selectedEntry.isShared && (
                    <span className="shared-badge">
                      Shared ·{" "}
                      {selectedEntry.permission}
                    </span>
                  )}

                </div>

              </div>

              <div className="detail-field">

                <label>
                  Username
                </label>

                <div className="detail-value">

                  <span>
                    {selectedEntry.username}
                  </span>

                  <button
                    onClick={() =>
                      copyPassword(
                        selectedEntry.username
                      )
                    }
                  >
                    Copy
                  </button>

                </div>

              </div>

              <div className="detail-field">

                <label>
                  Password
                </label>

                <div className="detail-value">

                  <span>
                    {visiblePassword
                      ? selectedEntry.password
                      : "•".repeat(
                          selectedEntry.password
                            ? selectedEntry.password.length
                            : 8
                        )}
                  </span>

                  <div className="detail-buttons">

                    <button
                      onClick={() =>
                        setVisiblePassword(
                          !visiblePassword
                        )
                      }
                    >
                      {visiblePassword
                        ? "Hide"
                        : "Show"}
                    </button>

                    <button
                      onClick={() =>
                        copyPassword(
                          selectedEntry.password
                        )
                      }
                    >
                      Copy
                    </button>

                  </div>

                </div>

              </div>

              <div className="detail-field">

                <label>
                  Website
                </label>

                <div className="detail-value">

                  <span>
                    {selectedEntry.website}
                  </span>

                </div>

              </div>

              <div className="detail-field">

                <label>
                  Notes
                </label>

                <div className="detail-notes">
                  {selectedEntry.notes ||
                    "No notes"}
                </div>

              </div>

              <div className="details-actions">

                {selectedEntry.isShared ? (

                  selectedEntry.permission ===
                  "EDIT" ? (

                    <button
                      className="edit-action"
                      onClick={() =>
                        openEdit(
                          selectedEntry
                        )
                      }
                    >
                      Edit
                    </button>

                  ) : (

                    <span className="view-only-text">
                      View Only
                    </span>

                  )

                ) : (

                  <>

                    <button
                      className="edit-action"
                      onClick={() =>
                        openEdit(
                          selectedEntry
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="share-action"
                      onClick={() =>
                        openShare(
                          selectedEntry
                        )
                      }
                    >
                      Share
                    </button>

                    <button
                      className="delete-action"
                      onClick={() =>
                        handleDelete(
                          selectedEntry.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </>

                )}

              </div>

            </div>

          </div>
        )}

      {/* SHARE MODAL */}

      {showShareForm &&
        selectedEntry && (

          <div className="share-modal-overlay">

            <div className="share-modal">

              <button
                className="modal-close"
                onClick={() => {
                  setShowShareForm(false);
                  setShareExpiryDate("");
                }}
              >
                X
              </button>

              <h2>
                Share Credential
              </h2>

              <p className="share-subtitle">
                Share{" "}
                <strong>
                  {selectedEntry.website}
                </strong>{" "}
                with another registered user.
              </p>

              <label>
                User Email
              </label>

              <input
                type="email"
                placeholder="Enter user's email"
                value={shareEmail}
                onChange={(e) =>
                  setShareEmail(
                    e.target.value
                  )
                }
              />

              <label>
                Permission
              </label>

              <select
                value={sharePermission}
                onChange={(e) =>
                  setSharePermission(
                    e.target.value
                  )
                }
              >

                <option value="VIEW">
                  View Only
                </option>

                <option value="EDIT">
                  View & Edit
                </option>

              </select>

              <label>
                Expiry Date (Optional)
              </label>

              <input
                type="date"
                value={shareExpiryDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setShareExpiryDate(
                    e.target.value
                  )
                }
              />

              <p className="expiry-help">
                Leave empty if you don't want
                the shared credential to expire.
              </p>

              <div className="share-modal-actions">

                <button
                  className="cancel-share-btn"
                  onClick={() => {
                    setShowShareForm(false);
                    setShareEmail("");
                    setSharePermission("VIEW");
                    setShareExpiryDate("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="confirm-share-btn"
                  onClick={handleShare}
                >
                  Share Credential
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default Vault;