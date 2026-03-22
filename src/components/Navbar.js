import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); setMenuOpen(false); };
  const close = () => { setMenuOpen(false); setDropdownOpen(false); };

  const dashboardPath =
    user?.role === 'teacher' ? '/teacher/dashboard' :
    user?.role === 'admin'   ? '/admin/dashboard'   :
    '/school/dashboard';

  const isActive = p => location.pathname === p;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close}>
          <img src="/logo.png" alt="AcadHR" style={{height:36}} onError={e=>{e.target.style.display="none"}}/>
          <span><span style={{color:"#1a2d5a",fontWeight:800}}>Acad</span><span style={{color:"#2979d4",fontWeight:800}}>HR</span></span>
        </Link>

        {/* Desktop links */}
        <div className={`navbar-links${menuOpen?' open':''}`}>
          <Link to="/jobs"            className={isActive('/jobs')?'active':''}            onClick={close}>Browse Jobs</Link>
          <Link to="/school/register" className={isActive('/school/register')?'active':''} onClick={close}>For Schools</Link>
          <Link to="/about"           className={isActive('/about')?'active':''}           onClick={close}>About</Link>
          {/* Mobile-only auth */}
          {!user && (
            <div className="mobile-auth">
              <Link to="/login"            className="btn btn-outline btn-sm" onClick={close}>Sign In</Link>
              <Link to="/teacher/register" className="btn btn-primary btn-sm" onClick={close}>Get Started</Link>
            </div>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-dropdown">
              <button className="user-btn" onClick={()=>setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
                <ChevronDown size={15}/>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to={dashboardPath} onClick={close}>
                    {user.role==='admin' ? <Shield size={15}/> : <LayoutDashboard size={15}/>}
                    {user.role==='admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  {user.role==='school' && (
                    <Link to="/school/post-job" onClick={close}>Post a Job</Link>
                  )}
                  <hr/>
                  <button onClick={handleLogout}><LogOut size={15}/> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="desktop-auth">
              <Link to="/login"            className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/teacher/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
          <button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>
    </nav>
  );
}
