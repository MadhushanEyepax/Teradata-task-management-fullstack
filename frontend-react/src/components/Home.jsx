import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h2 className="home-title">Welcome to Task Management System</h2>
      <p className="home-text">You are logged in!</p>

      <nav className="home-nav">
        <Link to="/tasks">Go to Tasks</Link> |
        <Link to="/services">Go to Services</Link>
      </nav>
    </div>
  );
}

export default Home;


