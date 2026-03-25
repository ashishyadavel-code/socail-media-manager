import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, PlusSquare, LogOut, Search, Bell, ShieldAlert, Users, Radio, PlaySquare } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const isAdmin = !!localStorage.getItem('admin_token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <div className="logo-gradient">Chai Wali Media {isAdmin && 'Admin'}</div>
      </div>
      
      <nav className="nav-menu">
        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <ShieldAlert size={24} /> <span>Moderation Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Users size={24} /> <span>User Management</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Home size={24} /> <span>Home</span>
            </NavLink>
            <NavLink to="/search" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Search size={24} /> <span>Search</span>
            </NavLink>
            <NavLink to="/notifications" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Bell size={24} /> <span>Notifications</span>
            </NavLink>
            <NavLink to="/create" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <PlusSquare size={24} /> <span>Create</span>
            </NavLink>
            <NavLink to="/live" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Radio size={24} /> <span>Live</span>
            </NavLink>
            <NavLink to="/heels" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <PlaySquare size={24} /> <span>Heels</span>
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <User size={24} /> <span>Profile</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="nav-bottom">
        <div className="nav-item text-danger" onClick={handleLogout}>
          <LogOut size={24} /> <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
