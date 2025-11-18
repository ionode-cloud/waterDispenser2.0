import React, { useState } from "react";
import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";


const Login = ({ setUser }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

   if (userId === "robo" && password === "1234") {
  setUser(userId); 
  setError("");
} else {
  setError(" Invalid username or password");
}
  };

  return (
    <section className="log-login-section">
      <div className="log-form-box">
        <div className="log-form-value">
          <form className="log-form" onSubmit={handleSubmit}>
            <div className="log-title">Login</div>
            <div className="log-inputbox">
              <ion-icon name="person-outline"></ion-icon>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="log-input"
              />
              <label className="log-label">User ID</label>
            </div>
            <div className="log-inputbox log-password-box">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="log-input"
              />
              <label className="log-label">Password</label>
              <span
                className="log-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                <ion-icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                ></ion-icon>
              </span>
            </div>
            {error && <div className="log-error">{error}</div>}
            <button type="submit" className="log-btn">Log in</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
