import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import SearchBar from "../components/SearchBar";
import CredentialCard from "../components/CredentialCard";
import "./Dashboard.css";

function Dashboard() {
  const credentials = [
    {
      website: "Google",
      username: "shravya@gmail.com",
      password: "Google@123",
      category: "Personal",
    },
    {
      website: "GitHub",
      username: "shravya123",
      password: "Github@456",
      category: "Development",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Navbar />

        <h2>Welcome Back 👋</h2>

        <div className="stats">
          <StatsCard title="Passwords" value="18" />
          <StatsCard title="Categories" value="5" />
          <StatsCard title="Security Score" value="95%" />
          <StatsCard title="Devices" value="2" />
        </div>

        <SearchBar />

        <button className="add-btn">
          + Add Credential
        </button>

        {credentials.map((item, index) => (
          <CredentialCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;