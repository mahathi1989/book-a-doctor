import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "patient" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.user, res.data.token);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0" style={{ maxWidth: 450, width: "100%" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="fas fa-stethoscope fa-2x text-primary mb-2"></i>
            <h3 className="fw-bold">Create Account</h3>
            <p className="text-muted small">Join BookADoctor today</p>
          </div>

          <div className="btn-group w-100 mb-4">
            <button
              type="button"
              className={`btn ${form.role === "patient" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setForm({ ...form, role: "patient" })}
            >
              <i className="fas fa-user me-1"></i> User
            </button>
            <button
              type="button"
              className={`btn ${form.role === "admin" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setForm({ ...form, role: "admin" })}
            >
              <i className="fas fa-user-shield me-1"></i> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" name="confirm" value={form.confirm} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 small">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
