import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GraduationCap } from 'lucide-react';
import './Auth.css';

const SUBJECTS = ['Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Physical Education', 'Art', 'Music', 'Hindi', 'Social Studies'];

export default function TeacherRegister() {
  const { registerTeacher } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', location: '', subjects: []
  });
  const [loading, setLoading] = useState(false);

  const toggleSubject = (s) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await registerTeacher(form);
      toast.success('Welcome to AcadHR!');
      navigate('/teacher/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <div className="auth-brand"><span style={{fontSize:'1.5rem',fontWeight:800,letterSpacing:'-.5px'}}><span style={{color:'var(--primary)'}}>Acad</span><span style={{color:'var(--accent)'}}>HR</span></span></div>
        <h1>Create Teacher Profile</h1>
        <p className="auth-sub">Join thousands of educators finding their dream jobs</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input required placeholder="Your full name"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input placeholder="+91 XXXXXXXXXX"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required placeholder="your@email.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Location (City, State)</label>
            <input placeholder="e.g. New Delhi, Delhi"
              value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Subjects you teach</label>
            <div className="subject-chips">
              {SUBJECTS.map(s => (
                <button key={s} type="button"
                  className={`chip ${form.subjects.includes(s) ? 'selected' : ''}`}
                  onClick={() => toggleSubject(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Teacher Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
          <p style={{marginTop: 8}}>Are you a school? <Link to="/school/register">Register Institution</Link></p>
        </div>
      </div>

      <style>{`
        .subject-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip {
          padding: 6px 14px;
          border-radius: 20px;
          border: 2px solid var(--border);
          background: white;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: inherit;
          color: var(--text);
          transition: all 0.2s;
        }
        .chip.selected {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .chip:hover { border-color: var(--primary); }
      `}</style>
    </div>
  );
}
