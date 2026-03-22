import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GraduationCap, Phone, Info } from 'lucide-react';
import './Auth.css';

export default function SchoolRegister() {
  const { registerSchool } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    institutionName: '', type: 'school',
    city: '', state: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const setF = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.institutionName.trim()) e.institutionName = 'Institution name is required';
    if (!form.city.trim())            e.city            = 'City is required';
    if (!form.state.trim())           e.state           = 'State is required';
    if (!form.phone.trim())           e.phone           = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g,'')))
                                      e.phone           = 'Enter a valid 10-digit Indian mobile number';
    if (!form.name.trim())            e.name            = 'Contact person name is required';
    if (!form.email.trim())           e.email           = 'Email is required';
    if (form.password.length < 6)     e.password        = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerSchool({ ...form, phone: form.phone.replace(/\s/g,'') });
      toast.success('Institution registered! Awaiting admin verification.');
      navigate('/school/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const Err = ({ field }) => errors[field]
    ? <span className="field-err"><Info size={11}/> {errors[field]}</span>
    : null;

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 580 }}>
        <div className="auth-brand"><span style={{fontSize:"1.5rem",fontWeight:800,letterSpacing:"-.5px"}}><span style={{color:"var(--primary)"}}>Acad</span><span style={{color:"var(--accent)"}}>HR</span></span></div>
        <h1>Register Your Institution</h1>
        <p className="auth-sub">Find qualified teachers for your school or college</p>

        {/* Info banner */}
        <div className="auth-info-banner">
          <Info size={14}/>
          After registration, an admin will verify your institution before you can post jobs.
          Provide a valid mobile number so we can contact you quickly.
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label>Institution Name <span className="req-star">*</span></label>
            <input placeholder="e.g. Delhi Public School"
              value={form.institutionName} onChange={e => setF('institutionName', e.target.value)}
              className={errors.institutionName ? 'err' : ''}/>
            <Err field="institutionName"/>
          </div>

          <div className="form-group">
            <label>Institution Type <span className="req-star">*</span></label>
            <select value={form.type} onChange={e => setF('type', e.target.value)}>
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
              <option value="institute">Institute / Coaching</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City <span className="req-star">*</span></label>
              <input placeholder="New Delhi"
                value={form.city} onChange={e => setF('city', e.target.value)}
                className={errors.city ? 'err' : ''}/>
              <Err field="city"/>
            </div>
            <div className="form-group">
              <label>State <span className="req-star">*</span></label>
              <input placeholder="Delhi"
                value={form.state} onChange={e => setF('state', e.target.value)}
                className={errors.state ? 'err' : ''}/>
              <Err field="state"/>
            </div>
          </div>

          {/* MOBILE — mandatory */}
          <div className="form-group">
            <label><Phone size={13} style={{marginRight:5}}/> Mobile Number <span className="req-star">*</span></label>
            <input type="tel" placeholder="9XXXXXXXXX (10-digit)"
              value={form.phone} onChange={e => setF('phone', e.target.value)}
              className={errors.phone ? 'err' : ''}/>
            <Err field="phone"/>
            <span className="field-hint">Used by admin to verify your institution — will not be shared publicly</span>
          </div>

          <div className="auth-divider"/>

          <div className="form-group">
            <label>Contact Person Name <span className="req-star">*</span></label>
            <input placeholder="Your full name"
              value={form.name} onChange={e => setF('name', e.target.value)}
              className={errors.name ? 'err' : ''}/>
            <Err field="name"/>
          </div>

          <div className="form-group">
            <label>Email Address <span className="req-star">*</span></label>
            <input type="email" placeholder="admin@school.edu"
              value={form.email} onChange={e => setF('email', e.target.value)}
              className={errors.email ? 'err' : ''}/>
            <Err field="email"/>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password <span className="req-star">*</span></label>
              <input type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setF('password', e.target.value)}
                className={errors.password ? 'err' : ''}/>
              <Err field="password"/>
            </div>
            <div className="form-group">
              <label>Confirm Password <span className="req-star">*</span></label>
              <input type="password" placeholder="Re-enter password"
                value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'err' : ''}/>
              <Err field="confirmPassword"/>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registering…' : 'Register Institution'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already registered? <Link to="/login">Sign In</Link></p>
          <p>Are you a teacher? <Link to="/teacher/register">Create Teacher Profile</Link></p>
        </div>
      </div>
    </div>
  );
}
