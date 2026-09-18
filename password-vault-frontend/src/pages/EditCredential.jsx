import { useState } from "react";
import "./EditCredential.css";

function EditCredential() {
  const [credential, setCredential] = useState({
    website: "Google",
    url: "https://google.com",
    username: "shravya@gmail.com",
    password: "Google@123",
    category: "Personal",
    notes: "Personal Gmail Account",
  });

  const handleChange = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Credential Updated Successfully!");
  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>✏ Edit Credential</h2>

        <form onSubmit={handleSubmit}>

          <label>Website Name</label>
          <input
            type="text"
            name="website"
            value={credential.website}
            onChange={handleChange}
          />

          <label>Website URL</label>
          <input
            type="text"
            name="url"
            value={credential.url}
            onChange={handleChange}
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={credential.username}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credential.password}
            onChange={handleChange}
          />

          <label>Category</label>

          <select
            name="category"
            value={credential.category}
            onChange={handleChange}
          >
            <option>Personal</option>
            <option>Work</option>
            <option>Social</option>
            <option>Banking</option>
          </select>

          <label>Notes</label>

          <textarea
            name="notes"
            value={credential.notes}
            onChange={handleChange}
          />

          <button type="submit">
            Update Credential
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditCredential;