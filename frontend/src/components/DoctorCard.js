import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0 doctor-card">
        <div className="card-body text-center">
          <div className="mb-3">
            <i className="fas fa-user-md fa-3x text-primary"></i>
          </div>
          <h5 className="card-title fw-bold">Dr. {doctor.userId?.name}</h5>
          <p className="text-primary mb-1">{doctor.specialization}</p>
          <p className="text-muted small mb-1">
            <i className="fas fa-graduation-cap me-1"></i>{doctor.qualification}
          </p>
          <p className="text-muted small mb-1">
            <i className="fas fa-briefcase me-1"></i>{doctor.experience} yrs experience
          </p>
          <p className="text-muted small mb-2">
            <i className="fas fa-map-marker-alt me-1"></i>{doctor.address}
          </p>
          <p className="fw-semibold mb-3">₹{doctor.fees} / consultation</p>
          <Link to={`/book/${doctor._id}`} className="btn btn-primary w-100">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
