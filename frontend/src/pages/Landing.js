import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="hero-section text-white d-flex align-items-center">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Your Health, <br />One Click Away
              </h1>
              <p className="lead mb-4">
                Find trusted doctors, book appointments instantly, and manage your
                healthcare journey — all in one place.
              </p>
              {!user ? (
                <div className="d-flex gap-3">
                  <Link to="/register" className="btn btn-light btn-lg text-primary fw-semibold">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    Login
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard" className="btn btn-light btn-lg text-primary fw-semibold">
                  Go to Dashboard
                </Link>
              )}
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <i className="fas fa-user-md" style={{ fontSize: "16rem", opacity: 0.25 }}></i>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose BookADoctor?</h2>
          <div className="row g-4">
            {[
              { icon: "fa-search", title: "Find Doctors Easily", desc: "Filter by specialty, location, and availability to find the right doctor fast." },
              { icon: "fa-calendar-check", title: "Instant Booking", desc: "Book appointments in seconds with real-time slot availability." },
              { icon: "fa-bell", title: "Smart Reminders", desc: "Get notified about confirmations, status updates, and upcoming visits." },
              { icon: "fa-file-medical", title: "Manage Records", desc: "Upload documents and keep track of visit summaries and prescriptions." },
              { icon: "fa-user-shield", title: "Verified Doctors", desc: "Every doctor is reviewed and approved by our admin team." },
              { icon: "fa-mobile-alt", title: "Access Anywhere", desc: "Manage your appointments and history from any device." },
            ].map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 border-0 shadow-sm text-center p-4">
                  <i className={`fas ${f.icon} fa-2x text-primary mb-3`}></i>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted small">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
