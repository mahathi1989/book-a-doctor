import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ApplyDoctor from "./pages/ApplyDoctor";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <AdminPanel />;
  if (user?.role === "doctor") return <DoctorAppointments />;
  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/apply-doctor" element={<ProtectedRoute allowedRoles={["patient"]}><ApplyDoctor /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute allowedRoles={["patient"]}><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute allowedRoles={["patient"]}><Appointments /></ProtectedRoute>} />
          <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorAppointments /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPanel /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
