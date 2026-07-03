import React, { useState, useEffect } from "react";
import moment from "moment";
import { notificationAPI } from "../utils/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationAPI.getAll().then((res) => {
      setNotifications(res.data);
      setLoading(false);
      notificationAPI.markAllRead();
    });
  }, []);

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4"><i className="fas fa-bell text-primary me-2"></i>Notifications</h4>

      {notifications.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="fas fa-bell-slash fa-3x mb-3"></i>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="list-group shadow-sm">
          {notifications.map((n) => (
            <div key={n._id} className={`list-group-item ${!n.isRead ? "bg-light" : ""}`}>
              <div className="d-flex justify-content-between">
                <p className="mb-1">{n.message}</p>
                <small className="text-muted">{moment(n.createdAt).fromNow()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
