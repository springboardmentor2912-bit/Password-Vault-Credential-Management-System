import { useState } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    fullName: "Bathini Shravya",
    email: "shravya@gmail.com",
    phone: "9876543210",
    location: "Hyderabad",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={user.location}
            onChange={handleChange}
          />

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;