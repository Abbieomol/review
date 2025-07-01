import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const goToAppReview = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Welcome to the Dashboard</h1>
        <p className="dashboard-text">
          Use the buttons below to manage your session or review apps.
        </p>
        <div className="dashboard-buttons">
          <button onClick={goToAppReview} className="dashboard-btn review-btn">
            Go to App Reviews
          </button>
          <button onClick={handleLogout} className="dashboard-btn logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
