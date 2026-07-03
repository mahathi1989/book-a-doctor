import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doctorAPI } from "../utils/api";

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    specialization: "",
    experience: "",
    fees: "",
    qualification: "",
    address: "",
    phone: "",
    about: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await doctorAPI.applyDoctor(form);
      toast.success("Application submitted! Awaiting admin approval.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    "General Physician", "Cardiologist", "Dermatologist", "Pediatrician",
    "Orthopedic", "Gynecologist", "Neurologist", "ENT Specialist", "Dentist", "Psychiatrist",
  ];

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 600 }}>
        <div className="card-body p-4">
          <h4 className="fw-bold mb-1"><i className="fas fa-user-md text-primary me-2"></i>Apply as a Doctor</h4>
          <p className="text-muted small mb-4">Fill in your professional details for admin review</p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Specialization</label>
                <select className="form-select" name="specialization" value={form.specialization} onChange={handleChange} required>
                  <option value="">Select</option>
                  {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Experience (years)</label>
                <input type="number" className="form-control" name="experience" value={form.experience} onChange={handleChange} required min={0} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Consultation Fees (₹)</label>
                <input type="number" className="form-control" name="fees" value={form.fees} onChange={handleChange} required min={0} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label">Qualification</label>
                <input type="text" className="form-control" name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. MBBS, MD" required />
              </div>
              <div className="col-12">
                <label className="form-label">Clinic/Hospital Address</label>
                <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label">About You</label>
                <textarea className="form-control" name="about" rows={3} value={form.about} onChange={handleChange} placeholder="Brief professional bio"></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4 fw-semibold" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyDoctor;
