import { useState } from "react";
import axios from "axios";
import "./AddCredential.css";

function AddCredential() {

  const [formData, setFormData] = useState({
    website: "",
    url: "",
    username: "",
    password: "",
    category: "Personal",
    notes: "",
    favorite: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==========================
  // Generate Password
  // ==========================

  const generatePassword = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://securevault-osrq.onrender.com/api/password/generate?length=16",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        password: response.data.password,
      }));

    } catch (error) {
      console.log("GENERATE PASSWORD ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      alert("Unable to generate password");
    }
  };

  // ==========================
  // Save Credential
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://securevault-osrq.onrender.com/api/credentials",
        {
          website: formData.website,
          username: formData.username,
          password: formData.password,
          notes: formData.notes,
          category: formData.category,
          favorite: formData.favorite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Credential Saved Successfully");

      setFormData({
        website: "",
        url: "",
        username: "",
        password: "",
        category: "Personal",
        notes: "",
        favorite: false,
      });

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

  return (
    <div className="add-container">

      <div className="add-card">

        <h2>🔐 Add New Credential</h2>

        <form onSubmit={handleSubmit}>

          <label>Website Name</label>

          <input
            type="text"
            name="website"
            placeholder="Google"
            value={formData.website}
            onChange={handleChange}
            required
          />

          <label>Website URL</label>

          <input
            type="url"
            name="url"
            placeholder="https://google.com"
            value={formData.url}
            onChange={handleChange}
          />

          <label>Username / Email</label>

          <input
            type="text"
            name="username"
            placeholder="name@example.com"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="text"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="generate-btn"
            onClick={generatePassword}
          >
            🔑 Generate Password
          </button>

          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Personal</option>
            <option>Work</option>
            <option>Social</option>
            <option>Banking</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          <label>Notes</label>

          <textarea
            name="notes"
            rows="4"
            placeholder="Additional Notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <div className="favorite-section">

            <label className="favorite-label">

              <input
                type="checkbox"
                name="favorite"
                checked={formData.favorite}
                onChange={handleChange}
              />

              <span>Mark as Favorite</span>

            </label>

          </div>

          <button type="submit">
            Save Credential
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddCredential;