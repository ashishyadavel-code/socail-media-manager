import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import AdminLogin from './pages/AdminLogin';
import Live from './pages/Live';
import Heels from './pages/Heels';
import './index.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdminAuthenticated = !!localStorage.getItem('admin_token');

  // Check if we are on the admin login page
  const isAdminLoginRoute = window.location.pathname === '/admin/login';

  if (!isAuthenticated && !isAdminAuthenticated && !isAdminLoginRoute) {
    return (
      <Router>
        <Auth />
      </Router>
    );
  }

  // If solely hitting the admin login page.
  if (isAdminLoginRoute) {
    return (
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/live" element={<Live />} />
            <Route path="/heels" element={<Heels />} />
            <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/:tab" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
