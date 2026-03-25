import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { api } from '../api';
import { ShieldAlert, Trash2, Ban, CheckCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { tab } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/list/');
      setUsers(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (id, username) => {
    if (window.confirm(`Block ${username}?`)) {
      try {
        await api.post(`/admin/users/${id}/block/`);
        alert('Blocked');
        fetchUsers();
      } catch(e) { alert('Failed'); }
    }
  };

  const unblockUser = async (id, username) => {
    if (window.confirm(`Unblock ${username}?`)) {
      try {
        await api.post(`/admin/users/${id}/unblock/`);
        alert('Unblocked');
        fetchUsers();
      } catch(e) { alert('Failed'); }
    }
  };

  const deleteUser = async (id, username) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete ${username}? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${id}/delete/`);
        alert('User deleted permanently.');
        fetchUsers();
      } catch(e) { alert('Failed to delete user.'); }
    }
  };

  return (
    <div className="admin-container animate-fade-in">
      <div className="admin-header">
        <ShieldAlert size={32} color="var(--danger)" />
        <h2>{tab === 'users' ? 'User Management' : 'Moderation Dashboard'}</h2>
      </div>

      <div className="glass-panel admin-panel">
        {tab === 'users' ? (
          <>
            <h3>User Management</h3>
            <div className="admin-list">
              {users.map(u => (
                <div key={u.id} className="admin-list-item">
                  <div>
                    <strong>{u.username}</strong> ({u.email})
                    {!u.is_active && <span className="badge-danger">Blocked</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className={`btn btn-secondary ${!u.is_active ? 'text-success' : 'text-danger'}`}
                      onClick={() => u.is_active ? blockUser(u.id, u.username) : unblockUser(u.id, u.username)}
                    >
                      {!u.is_active ? <><CheckCircle size={16} /> Unblock</> : <><Ban size={16} /> Block</>}
                    </button>
                    <button 
                      className="btn btn-secondary text-danger"
                      onClick={() => deleteUser(u.id, u.username)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Welcome to the Admin Dashboard. Select an option from the sidebar to manage the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
