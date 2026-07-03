import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { appointmentAPI } from "../utils/api";

const statusColors = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  completed: "primary",
  cancelled: "secondary",
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentAPI.getPatientAppointments();
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await appointmentAPI.cancelAppointment(id);
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4"><i className="fas fa-calendar-check text-primary me-2"></i>My Appointments</h4>

      {appointments.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="fas fa-calendar-times fa-3x mb-3"></i>
          <p>No appointments yet.</p>
        </div>
      ) : (
        <div className="row g-3">
          {appointments.map((a) => (
            <div className="col-md-6" key={a._id}>
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">Dr. {a.doctorId?.userId?.name}</h6>
                    <span className={`badge bg-${statusColors[a.status]} text-capitalize`}>{a.status}</span>
                  </div>
                  <p className="text-muted small mb-1"><i className="fas fa-stethoscope me-2"></i>{a.doctorId?.specialization}</p>
                  <p className="text-muted small mb-1"><i className="fas fa-calendar me-2"></i>{moment(a.date).format("DD MMM YYYY")} at {a.time}</p>
                  {a.reason && <p className="text-muted small mb-1"><i className="fas fa-notes-medical me-2"></i>{a.reason}</p>}
                  {a.visitSummary && (
                    <div className="mt-2 p-2 bg-light rounded small">
                      <strong>Visit Summary:</strong> {a.visitSummary}
                      {a.prescription && <p className="mb-0"><strong>Prescription:</strong> {a.prescription}</p>}
                      {a.followUpNotes && <p className="mb-0"><strong>Follow-up:</strong> {a.followUpNotes}</p>}
                    </div>
                  )}
                  {["pending", "approved"].includes(a.status) && (
                    <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => handleCancel(a._id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
