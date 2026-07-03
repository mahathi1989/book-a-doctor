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

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [notesForm, setNotesForm] = useState({ visitSummary: "", followUpNotes: "", prescription: "" });

  const fetchAppointments = async () => {
    try {
      const res = await appointmentAPI.getDoctorAppointments();
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const submitNotes = async (id) => {
    try {
      await appointmentAPI.updateStatus(id, { status: "completed", ...notesForm });
      toast.success("Visit summary saved");
      setEditingId(null);
      setNotesForm({ visitSummary: "", followUpNotes: "", prescription: "" });
      fetchAppointments();
    } catch {
      toast.error("Failed to save notes");
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
                    <h6 className="fw-bold mb-0">{a.patientId?.name}</h6>
                    <span className={`badge bg-${statusColors[a.status]} text-capitalize`}>{a.status}</span>
                  </div>
                  <p className="text-muted small mb-1"><i className="fas fa-calendar me-2"></i>{moment(a.date).format("DD MMM YYYY")} at {a.time}</p>
                  {a.reason && <p className="text-muted small mb-1"><i className="fas fa-notes-medical me-2"></i>{a.reason}</p>}
                  {a.patientId?.phone && <p className="text-muted small mb-2"><i className="fas fa-phone me-2"></i>{a.patientId.phone}</p>}

                  {a.status === "pending" && (
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-success" onClick={() => updateStatus(a._id, "approved")}>Approve</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(a._id, "rejected")}>Reject</button>
                    </div>
                  )}

                  {a.status === "approved" && editingId !== a._id && (
                    <button className="btn btn-sm btn-primary" onClick={() => setEditingId(a._id)}>
                      Complete & Add Notes
                    </button>
                  )}

                  {editingId === a._id && (
                    <div className="mt-2">
                      <textarea
                        className="form-control form-control-sm mb-2"
                        placeholder="Visit summary"
                        value={notesForm.visitSummary}
                        onChange={(e) => setNotesForm({ ...notesForm, visitSummary: e.target.value })}
                      />
                      <textarea
                        className="form-control form-control-sm mb-2"
                        placeholder="Prescription"
                        value={notesForm.prescription}
                        onChange={(e) => setNotesForm({ ...notesForm, prescription: e.target.value })}
                      />
                      <textarea
                        className="form-control form-control-sm mb-2"
                        placeholder="Follow-up notes"
                        value={notesForm.followUpNotes}
                        onChange={(e) => setNotesForm({ ...notesForm, followUpNotes: e.target.value })}
                      />
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={() => submitNotes(a._id)}>Save & Complete</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {a.status === "completed" && a.visitSummary && (
                    <div className="mt-2 p-2 bg-light rounded small">
                      <strong>Summary:</strong> {a.visitSummary}
                    </div>
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

export default DoctorAppointments;
