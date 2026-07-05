import axios from "axios";

const API = axios.create({ baseURL: "https://book-a-doctor-rq7t.onrender.com/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
};

export const userAPI = {
  getProfile: () => API.get("/users/profile"),
  updateProfile: (data) => API.put("/users/profile", data),
};

export const doctorAPI = {
  applyDoctor: (data) => API.post("/doctors/apply", data),
  getAllDoctors: (params) => API.get("/doctors", { params }),
  getDoctorById: (id) => API.get(`/doctors/${id}`),
  getDoctorProfile: () => API.get("/doctors/profile"),
  updateDoctorProfile: (data) => API.put("/doctors/profile", data),
};

export const appointmentAPI = {
  bookAppointment: (data) => API.post("/appointments/book", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  getPatientAppointments: () => API.get("/appointments/patient"),
  getDoctorAppointments: () => API.get("/appointments/doctor"),
  updateStatus: (id, data) => API.put(`/appointments/${id}/status`, data),
  cancelAppointment: (id) => API.put(`/appointments/${id}/cancel`),
  getAllAppointments: () => API.get("/appointments/all"),
};

export const adminAPI = {
  getDoctorApplications: () => API.get("/admin/doctors"),
  updateDoctorStatus: (id, data) => API.put(`/admin/doctors/${id}/status`, data),
  getAllUsers: () => API.get("/admin/users"),
  getStats: () => API.get("/admin/stats"),
};

export const notificationAPI = {
  getAll: () => API.get("/notifications"),
  markAllRead: () => API.put("/notifications/read-all"),
};

export default API;
