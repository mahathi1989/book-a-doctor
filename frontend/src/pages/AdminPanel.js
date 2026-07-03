import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { adminAPI } from "../utils/api";

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("applications");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getDoctorApplications(),
        adminAPI.getAllUsers(),
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
      setUsers(usersRes.data);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDoctorStatus = async (id, status) => {
    try {
      await adminAPI.updateDoctorStatus(id, { status });
      toast.success(`Doctor application ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  const statusColors = { pending: "warning", approved: "success", rejected: "danger" };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4"><i className="fas fa-user-shield text-primary me-2"></i>Admin Panel</h4>

      <div className="row g-3 mb-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: "fa-users", color: "primary" },
          { label: "Active Doctors", value: stats.totalDoctors, icon: "fa-user-md", color: "success" },
          { label: "Pending Applications", value: stats.pendingApplications, icon: "fa-clock", color: "warning" },
          { label: "Total Appointments", value: stats.totalAppointments, icon: "fa-calendar-check", color: "info" },
        ].map((s, i) => (
          <div className="col-md-3 col-6" key={i}>
            <div className="card border-0 shadow-sm text-center p-3">
              <i className={`fas ${s.icon} fa-2x text-${s.color} mb-2`}></i>
              <h4 className="fw-bold mb-0">{s.value}</h4>
              <p className="text-muted small mb-0">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === "applications" ? "active" : ""}`} onClick={() => setTab("applications")}>
            Doctor Applications
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
            All Users
          </button>
        </li>
      </ul>

      {tab === "applications" && (
        <div className="table-responsive">
          <table className="table table-hover bg-white shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th><th>Specialization</th><th>Experience</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((d) => (
                <tr key={d._id}>
                  <td>{d.userId?.name}</td>
                  <td>{d.specialization}</td>
                  <td>{d.experience} yrs</td>
                  <td><span className={`badge bg-${statusColors[d.status]} text-capitalize`}>{d.status}</span></td>
                  <td>
                    {d.status === "pending" && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success" onClick={() => handleDoctorStatus(d._id, "approved")}>Approve</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDoctorStatus(d._id, "rejected")}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-3">No applications yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="table-responsive">
          <table className="table table-hover bg-white shadow-sm">
            <thead className="table-light">
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="text-capitalize">{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
