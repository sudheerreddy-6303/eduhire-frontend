import React from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import './RoleModal.css';

export default function RoleModal({ onClose }) {
  return (
    <div className="role-modal-overlay" onClick={onClose}>
      <div className="role-modal" onClick={e => e.stopPropagation()}>

        <button className="role-modal-close" onClick={onClose}><X size={20}/></button>

        <div className="role-modal-title">
          <Sparkles size={20} style={{color:'#2979d4'}}/>
          Welcome to AcadHR!
        </div>
        <p className="role-modal-sub">Choose how you want to get started</p>

        <div className="role-options">
          <Link to="/teacher/register" className="role-option teacher-option" onClick={onClose}>
            <div className="role-option-icon">🎓</div>
            <div className="role-option-text">
              <div className="role-option-title">I'm a Teacher / Job Seeker</div>
              <div className="role-option-desc">Looking for teaching jobs at schools and colleges</div>
            </div>
            <ArrowRight size={18} className="role-option-arrow"/>
          </Link>

          <Link to="/school/register" className="role-option school-option" onClick={onClose}>
            <div className="role-option-icon">🏫</div>
            <div className="role-option-text">
              <div className="role-option-title">I'm a School / Institution</div>
              <div className="role-option-desc">Looking to hire qualified teachers for my school</div>
            </div>
            <ArrowRight size={18} className="role-option-arrow"/>
          </Link>
        </div>

        <p className="role-modal-login">
          Already have an account?{' '}
          <Link to="/login" onClick={onClose}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
