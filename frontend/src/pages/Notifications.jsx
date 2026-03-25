import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Bell, CheckCircle } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read/`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notifications-container animate-fade-in">
      <div className="notifications-header">
        <Bell size={32} color="var(--accent-primary)" />
        <h2>Your Notifications</h2>
      </div>

      <div className="notifications-list">
        {loading ? (
          <p className="text-secondary text-center mt-5">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="glass-panel text-center p-5">
            <Bell size={48} color="var(--text-secondary)" style={{opacity: 0.5, marginBottom: '20px'}}/>
            <p className="text-secondary">No notifications yet.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`glass-panel notification-item ${n.is_read ? 'read' : 'unread'}`}>
              <div className="notification-content">
                <div className="notification-avatar">
                  {n.sender?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p>{n.message}</p>
                  <span className="notification-time">{new Date(n.created_at).toLocaleString()}</span>
                </div>
              </div>
              
              {!n.is_read && (
                <button 
                  className="btn btn-secondary mark-read-btn"
                  onClick={() => markAsRead(n.id)}
                >
                  <CheckCircle size={16} /> Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
