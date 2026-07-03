import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { doctorAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import DoctorCard from "../components/DoctorCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDoctorApplicant, setIsDoctorApplicant] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorAPI.getAllDoctors({ search, specialization });
      setDoctors(res.data);
    } catch (err) {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    if (user.role === "patient") {
      doctorAPI.getDoctorProfile().then(() => setIsDoctorApplicant(true)).catch(() => {});
    }
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const specializations = [
    "General Physician", "Cardiologist", "Dermatologist", "Pediatrician",
    "Orthopedic", "Gynecologist", "Neurologist", "ENT Specialist", "Dentist", "Psychiatrist",
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0">Welcome, {user.name} 👋</h3>
          <p className="text-muted mb-0">Find and book your next appointment</p>
        </div>
        {user.role === "patient" && !isDoctorApplicant && (
          <Link to="/apply-doctor" className="btn btn-outline-primary">
            <i className="fas fa-user-md me-2"></i>Apply as Doctor
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="card shadow-sm border-0 p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, specialty, or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              <i className="fas fa-search me-1"></i>Search
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="fas fa-user-md fa-3x mb-3"></i>
          <p>No doctors found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="row">
          {doctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
