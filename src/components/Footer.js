import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Mail, Phone } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-acad">Acad</span><span className="logo-hr">HR</span>
          </Link>
          <p>India's leading platform connecting qualified teachers with the best schools and institutions.</p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter"><Twitter size={18}/></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={18}/></a>
            <a href="#" aria-label="Facebook"><Facebook size={18}/></a>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>For Teachers</h4>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/teacher/register">Create Profile</Link>
            <Link to="/login">Sign In</Link>
          </div>
          <div>
            <h4>For Schools</h4>
            <Link to="/school/register">Register School</Link>
            <Link to="/school/post-job">Post a Job</Link>
            <Link to="/login">School Login</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <a href="mailto:hello@acadhr.com"><Mail size={13}/> Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 AcadHR. All rights reserved.</p>
      </div>
    </footer>
  );
}
