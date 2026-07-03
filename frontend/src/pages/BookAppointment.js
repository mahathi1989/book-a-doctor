import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { doctorAPI, appointmentAPI } from "../utils/api";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", reason: "" });
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    doctorAPI.getDoctorById(id).then((res) => setDoctor(res.data)).catch(() => {
      toast.error("Doctor not found");
      navigate("/dashboard");
    });
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("doctorId", id);
      data.append("date", form.date);
      data.append("time", form.time);
      data.append("reason", form.reason);
      if (document) data.append("document", document);

      await appointmentAPI.bookAppointment(data);
      toast.success("Appointment request sent! Awaiting doctor confirmation.");
      navigate("/appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const minDate = moment().format("YYYY-MM-DD");

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 600 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-4">
            <i className="fas fa-user-md fa-2x text-primary me-3"></i>
            <div>
              <h5 className="fw-bold mb-0">Dr. {doctor.userId?.name}</h5>
              <p className="text-muted mb-0 small">{doctor.specialization} • ₹{doctor.fees}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Appointment Date</label>
                <input type="date" className="form-control" name="date" min={minDate} value={form.date} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Preferred Time</label>
                <input type="time" className="form-control" name="time" value={form.time} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label">Reason for Visit</label>
                <textarea className="form-control" name="reason" rows={3} value={form.reason} onChange={handleChange} placeholder="Briefly describe your symptoms or reason"></textarea>
              </div>
              <div className="col-12">
                <label className="form-label">Upload Medical Records (optional)</label>
                <input type="file" className="form-control" onChange={(e) => setDocument(e.target.files[0])} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4 fw-semibold" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
