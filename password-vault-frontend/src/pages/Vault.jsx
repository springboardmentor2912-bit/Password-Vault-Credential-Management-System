import { useEffect, useState } from "react";
import axios from "axios";
import "./Vault.css";

function Vault() {

  const [credentials, setCredentials] = useState([]);
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Form
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Personal");
  const [favorite, setFavorite] = useState(false);

  // ==========================
  // SHARE STATES
  // ==========================

  const [showShareBox, setShowShareBox] = useState(false);
  const [shareCredentialId, setShareCredentialId] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [permission, setPermission] = useState("VIEW_ONLY");

  // ==========================
  // LOAD CREDENTIALS
  // ==========================

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://securevault-osrq.onrender.com/api/credentials",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCredentials(response.data);

    } catch (error) {

      console.log("Load Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      alert("Unable to load credentials");
    }
  };

  // ==========================
  // GENERATE PASSWORD
  // ==========================

  const generatePassword = async () => {

    try {

      const response = await axios.get(
        "https://securevault-osrq.onrender.com/api/password/generate?length=16"
      );

      setPassword(response.data.password);

    } catch (error) {

      console.log(error);

      alert("Unable to generate password");
    }
  };

  // ==========================
  // SAVE CREDENTIAL
  // ==========================

  const saveCredential = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "https://securevault-osrq.onrender.com/api/credentials",
        {
          website,
          username,
          password,
          notes,
          category,
          favorite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Credential Saved Successfully");

      clearForm();
      loadCredentials();

    } catch (error) {

      console.log("SAVE ERROR:", error);

      if (error.response) {

        alert(
          "Status : " +
          error.response.status +
          "\n\n" +
          JSON.stringify(error.response.data)
        );

      } else {

        alert(error.message);
      }
    }
  };

  // ==========================
  // UPDATE CREDENTIAL
  // ==========================

  const updateCredential = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `https://securevault-osrq.onrender.com/api/credentials/${editingId}`,
        {
          website,
          username,
          password,
          notes,
          category,
          favorite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Credential Updated Successfully");

      clearForm();
      loadCredentials();

    } catch (error) {

      console.log("UPDATE ERROR:", error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message);
      }
    }
  };

  // ==========================
  // DELETE CREDENTIAL
  // ==========================

  const deleteCredential = async (id) => {

    if (!window.confirm("Delete this credential?")) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `https://securevault-osrq.onrender.com/api/credentials/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Credential Deleted Successfully");

      loadCredentials();

    } catch (error) {

      console.log(error);

      alert("Delete Failed");
    }
  };

  // ==========================
  // TOGGLE FAVORITE
  // ==========================

  const toggleFavorite = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `https://securevault-osrq.onrender.com/api/credentials/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadCredentials();

    } catch (error) {

      console.log(error);

      alert("Unable to update favorite");
    }
  };

  // ==========================
  // CLEAR FORM
  // ==========================

  const clearForm = () => {

    setEditingId(null);

    setWebsite("");
    setUsername("");
    setPassword("");
    setNotes("");
    setCategory("Personal");
    setFavorite(false);
  };

  // ==========================
  // PASSWORD VISIBILITY
  // ==========================

  const togglePassword = (id) => {

    setShowPassword({
      ...showPassword,
      [id]: !showPassword[id],
    });
  };

  // ==========================
  // COPY PASSWORD
  // ==========================

  const copyPassword = (password) => {

    navigator.clipboard.writeText(password);

    alert("Password Copied Successfully!");
  };

  // ==========================
  // SEARCH
  // ==========================

  const filtered = credentials.filter(
    (item) =>
      item.website
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.username
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (item.category || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==========================
  // OPEN SHARE BOX
  // ==========================

  const openShareBox = (credentialId) => {

    setShareCredentialId(credentialId);

    setRecipientEmail("");

    setPermission("VIEW_ONLY");

    setShowShareBox(true);
  };

  // ==========================
  // CLOSE SHARE BOX
  // ==========================

  const closeShareBox = () => {

    setShowShareBox(false);

    setShareCredentialId(null);

    setRecipientEmail("");

    setPermission("VIEW_ONLY");
  };

  // ==========================
  // SHARE CREDENTIAL
  // ==========================

  const shareCredential = async () => {

    if (!recipientEmail.trim()) {

      alert("Please enter recipient email");

      return;
    }

    if (!shareCredentialId) {

      alert("Credential not selected");

      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "https://securevault-osrq.onrender.com/api/sharing/share",
        {
          credentialId: shareCredentialId,
          recipientEmail: recipientEmail,
          permission: permission,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Credential Shared Successfully!");

      closeShareBox();

    } catch (error) {

      console.log("SHARE ERROR:", error);

      if (error.response) {

        alert(
          "Share Failed\n\nStatus: " +
          error.response.status +
          "\n\n" +
          JSON.stringify(error.response.data)
        );

      } else {

        alert("Network Error");
      }
    }
  };

  return (

    <div className="vault-container">

      <h1>🔐 Password Vault</h1>

      {/* ==========================
          ADD / EDIT FORM
      ========================== */}

      <div className="add-form">

        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <input
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="generate-btn"
          onClick={generatePassword}
        >
          🔑 Generate Password
        </button>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Social">Social</option>
          <option value="Banking">Banking</option>
          <option value="Shopping">Shopping</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>

        <div className="favorite-section">

          <label className="favorite-label">

            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
            />

            <span>⭐ Mark as Favorite</span>

          </label>

        </div>

        <button
          className="save-btn"
          onClick={
            editingId
              ? updateCredential
              : saveCredential
          }
        >
          {editingId
            ? "Update Credential"
            : "Save Credential"}
        </button>

      </div>

      <hr />

      {/* ==========================
          SEARCH
      ========================== */}

      <input
        className="search-box"
        type="text"
        placeholder="Search Website, Username or Category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ==========================
          CREDENTIAL GRID
      ========================== */}

      <div className="vault-grid">

        {filtered.length === 0 ? (

          <h3>No Credentials Found</h3>

        ) : (

          filtered.map((item) => (

            <div
              className="vault-card"
              key={item.id}
            >

              <div className="card-header">

                <h2>{item.website}</h2>

                <button
                  className="favorite-btn"
                  onClick={() =>
                    toggleFavorite(item.id)
                  }
                >
                  {item.favorite ? "⭐" : "☆"}
                </button>

              </div>

              <p>
                <strong>Username:</strong>{" "}
                {item.username}
              </p>

              <p>
                <strong>Password:</strong>{" "}
                {showPassword[item.id]
                  ? item.password
                  : "••••••••••••"}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {item.category}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {item.notes}
              </p>

              <div className="buttons">

                <button
                  onClick={() =>
                    togglePassword(item.id)
                  }
                >
                  {showPassword[item.id]
                    ? "Hide"
                    : "Show"}
                </button>

                <button
                  onClick={() =>
                    copyPassword(item.password)
                  }
                >
                  Copy
                </button>

                <button
                  onClick={() => {

                    setEditingId(item.id);

                    setWebsite(item.website ?? "");
                    setUsername(item.username ?? "");
                    setPassword(item.password ?? "");
                    setNotes(item.notes ?? "");
                    setCategory(item.category ?? "Personal");
                    setFavorite(item.favorite ?? false);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteCredential(item.id)
                  }
                >
                  Delete
                </button>

                {/* SHARE BUTTON */}

                <button
                  className="share-btn"
                  onClick={() =>
                    openShareBox(item.id)
                  }
                >
                  🔗 Share
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* ==========================
          SHARE POPUP
      ========================== */}

      {showShareBox && (

        <div className="share-overlay">

          <div className="share-modal">

            <h2>🔗 Share Credential</h2>

            <label>
              Recipient Email
            </label>

            <input
              type="email"
              placeholder="friend@gmail.com"
              value={recipientEmail}
              onChange={(e) =>
                setRecipientEmail(e.target.value)
              }
            />

            <label>
              Permission
            </label>

            <select
              value={permission}
              onChange={(e) =>
                setPermission(e.target.value)
              }
            >

              <option value="VIEW_ONLY">
                View Only
              </option>

              <option value="EDIT">
                Edit Access
              </option>

              <option value="FULL_MANAGEMENT">
                Full Management
              </option>

            </select>

            <div className="share-permission-info">

              {permission === "VIEW_ONLY" && (
                <p>
                  👁️ User can only view the credential.
                </p>
              )}

              {permission === "EDIT" && (
                <p>
                  ✏️ User can view and edit the credential.
                </p>
              )}

              {permission === "FULL_MANAGEMENT" && (
                <p>
                  🛠️ User can view, edit, delete and manage sharing.
                </p>
              )}

            </div>

            <div className="share-modal-buttons">

              <button
                className="share-confirm-btn"
                onClick={shareCredential}
              >
                🔗 Share Credential
              </button>

              <button
                className="share-cancel-btn"
                onClick={closeShareBox}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default Vault;