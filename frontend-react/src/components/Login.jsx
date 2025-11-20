import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //   console.log("Username:", username);
  //   console.log("Password:", password);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Stops the page from refreshing
    // Check if username is empty
    if (username === "") {
      setError("Username is required");
      return; //Stop here, don't continue
    }

    // Check if username is too short
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Check if password is empty
    if (password === "") {
      setError("Password is required");
      return;
    }

    // If we reach here, validation passed!
    console.log("Login successful! Redirecting...");
    navigate("/home");
  };

  return (
    // Returns JSX (looks like HTML, but it's JavaScript)
    <div className="login-container">
      <h2 className="login-title">Login Page</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {" "}
        {/* groups the input fields */}
        <div className="login-form-group">
          <label className="login-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="login-form-group">
          <label className="login-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
// test comment