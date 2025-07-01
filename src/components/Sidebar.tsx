import { Link } from "react-router-dom";

export default function Sidebar({ toggleDarkMode, darkMode }: { toggleDarkMode: () => void; darkMode: boolean }) {
  return (
    <aside style={{ padding: "1rem", width: "200px", background: "#eee", height: "100vh", position: "fixed" }}>
      <h2>Menu</h2>
      <nav>
        <ul>
          <li><Link to="/">App Reviews</Link></li>
          <li><button onClick={toggleDarkMode}>{darkMode ? "Light Mode" : "Dark Mode"}</button></li>
        </ul>
      </nav>
    </aside>
  );
}
