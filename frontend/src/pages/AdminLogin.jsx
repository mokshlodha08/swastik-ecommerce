import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api.adminLogin(email, password);
      localStorage.setItem("swastik_admin_token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="wrap">
      <div className="login-box">
        <h2 style={{ marginBottom: 20 }}>Admin login</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label className="field">
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label className="field">
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn primary block">Log in</button>
        </form>
      </div>
    </div>
  );
}
