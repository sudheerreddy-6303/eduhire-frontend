import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Linkedin, Facebook } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-link">
              <GraduationCap size={26} />
              <span>EduHire</span>
            </Link>
            <p>Connecting schools with qualified teachers. Building the future of education, one hire at a time.</p>
            <div className="social-links">
              <a href="#"><Twitter size={18} /></a>
              <a href="#"><Linkedin size={18} /></a>
              <a href="#"><Facebook size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>For Teachers</h4>
            <ul>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/teacher/register">Create Profile</Link></li>
              <li><Link to="/teacher/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Schools</h4>
            <ul>
              <li><Link to="/school/register">Register Institution</Link></li>
              <li><Link to="/school/post-job">Post a Job</Link></li>
              <li><Link to="/school/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about">Contact</Link></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 EduHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
