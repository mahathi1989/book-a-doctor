import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      toast.success("Login successful!");

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="fas fa-stethoscope fa-2x text-primary mb-2"></i>
            <h3 className="fw-bold">Welcome Back</h3>
            <p className="text-muted small">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 small">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
