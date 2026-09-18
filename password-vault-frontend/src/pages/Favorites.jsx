import { useState } from "react";
import "./Favorites.css";

function Favorites() {
  const [favorites] = useState([
    {
      id: 1,
      website: "Google",
      username: "shravya@gmail.com",
      password: "Google@123",
      category: "Personal",
    },
    {
      id: 2,
      website: "State Bank",
      username: "shravya123",
      password: "Bank@123",
      category: "Banking",
    },
  ]);

  const [showPassword, setShowPassword] = useState({});

  const togglePassword = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyPassword = (password) => {
    navigator.clipboard.writeText(password);
    alert("Password Copied!");
  };

  return (
    <div className="favorites-container">

      <h1>⭐ Favorite Credentials</h1>

      <div className="favorites-grid">

        {favorites.map((item) => (

          <div className="favorite-card" key={item.id}>

            <h2>{item.website}</h2>

            <p>
              <strong>Username:</strong> {item.username}
            </p>

            <p>
              <strong>Password:</strong>{" "}
              {showPassword[item.id]
                ? item.password
                : "************"}
            </p>

            <p>
              <strong>Category:</strong> {item.category}
            </p>

            <div className="favorite-buttons">

              <button
                onClick={() => togglePassword(item.id)}
              >
                {showPassword[item.id] ? "Hide" : "Show"}
              </button>

              <button
                onClick={() => copyPassword(item.password)}
              >
                Copy
              </button>

              <button>Remove ⭐</button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Favorites;