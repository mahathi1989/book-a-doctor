import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { userAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userAPI.getProfile().then((res) => {
      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
      });
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.updateProfile(form);
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="fas fa-user-circle fa-4x text-primary"></i>
            <h5 className="fw-bold mt-2">{user.name}</h5>
            <p className="text-muted small text-capitalize">{user.role} • {user.email}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
