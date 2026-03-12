import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { teacherAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Briefcase, Eye, Clock, CheckCircle, Search,
  Upload, FileText, User, MapPin, BookOpen, AlertCircle, Star
} from 'lucide-react';
import './Dashboard.css';

const STATUS = {
  pending:    { cls:'badge-amber', label:'Pending'     },
  reviewed:   { cls:'badge-blue',  label:'Reviewed'    },
  shortlisted:{ cls:'badge-green', label:'Shortlisted' },
  interview:  { cls:'badge-blue',  label:'Interview'   },
  accepted:   { cls:'badge-green', label:'Accepted'    },
  rejected:   { cls:'badge-red',   label:'Rejected'    },
};

const SUBJECTS = [
  'Mathematics','English','Science','Physics','Chemistry',
  'Biology','History','Geography','Computer Science',
  'Physical Education','Art','Music','Hindi','Social Studies','Economics'
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats]           = useState({});
  const [applications, setApps]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('applications');

  useEffect(() => {
    Promise.all([
      teacherAPI.getStats().catch(() => ({ data:{} })),
      applicationsAPI.getMyApplications().catch(() => ({ data:[] }))
    ]).then(([s, a]) => {
      setStats(s.data);
      setApps(a.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;

  return (
    <div>
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-welcome">
            <div className="welcome-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <h1>Welcome, {user?.name}! 👋</h1>
              <p>Track your applications and manage your profile</p>
            </div>
          </div>
          <Link to="/jobs" className="btn btn-accent"><Search size={15}/> Browse Jobs</Link>
        </div>
      </div>

      <div className="container dashboard-body">

        {/* Stats */}
        <div className="stats-cards">
          {[
            { icon:Briefcase,    value:stats.totalApplications||0, label:'Applied',       color:'green'  },
            { icon:Clock,        value:stats.pending||0,           label:'Pending',        color:'amber'  },
            { icon:CheckCircle,  value:stats.interviews||0,        label:'Interviews',     color:'blue'   },
            { icon:Eye,          value:stats.profileViews||0,      label:'Profile Views',  color:'purple' },
          ].map(s => (
            <div key={s.label} className={`stat-card stat-${s.color}`}>
              <s.icon size={24}/>
              <div className="stat-card-num">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button className={activeTab==='applications'?'active':''} onClick={()=>setActiveTab('applications')}>
            My Applications ({applications.length})
          </button>
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}>
            Profile & Resume
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab==='applications' && (
          <div className="card">
            <div className="card-header">
              <h2>My Applications</h2>
              <Link to="/jobs" className="btn btn-primary btn-sm"><Search size={13}/> Find Jobs</Link>
            </div>
            {applications.length===0 ? (
              <div className="empty-state">
                <Briefcase size={52}/>
                <h3>No Applications Yet</h3>
                <p>Upload your resume in the Profile tab, then start applying for teaching positions.</p>
                <div className="empty-actions">
                  <button className="btn btn-outline btn-sm" onClick={()=>setActiveTab('profile')}>
                    <Upload size={13}/> Upload Resume
                  </button>
                  <Link to="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
                </div>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map(app => (
                  <div key={app.id} className="application-item">
                    <div className="app-logo">{app.job?.school?.institutionName?.charAt(0)||'S'}</div>
                    <div className="app-info">
                      <div className="app-title">{app.job?.title}</div>
                      <div className="app-school">
                        {app.job?.school?.institutionName} &bull; {app.job?.school?.city}
                      </div>
                      <div className="app-date">
                        Applied {new Date(app.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </div>
                    </div>
                    <div className="app-status">
                      <span className={`badge ${STATUS[app.status]?.cls||'badge-gray'}`}>
                        {STATUS[app.status]?.label||app.status}
                      </span>
                      {app.status==='interview' && app.interviewDate && (
                        <div className="interview-date">
                          📅 {new Date(app.interviewDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab==='profile' && <TeacherProfileForm/>}
      </div>
    </div>
  );
}

/* ── Profile Form ── */
function TeacherProfileForm() {
  const [profile, setProfile] = useState({
    phone:'', location:'', bio:'', experience:0,
    expectedSalary:'', subjects:[]
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    teacherAPI.getProfile()
      .then(({ data }) => {
        setProfile({ phone:'', location:'', bio:'', experience:0, expectedSalary:'', subjects:[], ...data });
        setResumeUrl(data.resumeUrl||'');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleSubject = s =>
    setProfile(p => ({
      ...p,
      subjects: p.subjects.includes(s)
        ? p.subjects.filter(x=>x!==s)
        : [...p.subjects, s]
    }));

  const handleResumeUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const { data } = await teacherAPI.uploadResume(fd);
      setResumeUrl(data.resumeUrl);
      toast.success('✅ Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message||'Upload failed');
    }
    setUploading(false);
    e.target.value='';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await teacherAPI.updateProfile({ ...profile });
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;

  const filename = resumeUrl ? resumeUrl.split('/').pop() : null;

  return (
    <div className="card">
      <div className="card-header">
        <h2>My Profile &amp; Resume</h2>
        {!resumeUrl && (
          <span style={{display:'flex',alignItems:'center',gap:6,color:'#c62828',fontSize:'.8rem',fontWeight:700}}>
            <AlertCircle size={13}/> Resume required to apply
          </span>
        )}
      </div>

      {/* ── Resume Upload ── */}
      <div className={`resume-section${resumeUrl?' has-resume':''}`}>
        <div className="resume-section-title">
          <FileText size={16}/>
          Resume / CV
          <span className="resume-required-tag">REQUIRED</span>
          {resumeUrl && <span style={{background:'#e6f4ee',color:'var(--primary)',padding:'2px 10px',borderRadius:20,fontSize:'.72rem',fontWeight:700,marginLeft:4}}>✓ Uploaded</span>}
        </div>
        <p>
          Upload your resume in PDF, DOC or DOCX format (max 5 MB).<br/>
          <strong>You must have a resume uploaded to apply for any job.</strong>
        </p>
        <div className="resume-file-row">
          <label className="resume-upload-label">
            <Upload size={15}/>
            {uploading ? 'Uploading…' : resumeUrl ? 'Replace Resume' : 'Upload Resume'}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploading}/>
          </label>
          {resumeUrl && (
            <div className="resume-current">
              <CheckCircle size={15}/>
              <a href={`https://eduhire-backen.onrender.com${resumeUrl}`} target="_blank" rel="noreferrer">{filename}</a>
              <span className="resume-view-hint">(click to preview)</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Fields ── */}
      <div className="form-row">
        <div className="form-group">
          <label><User size={12} style={{marginRight:5}}/>Phone</label>
          <input value={profile.phone||''} onChange={e=>setProfile({...profile,phone:e.target.value})} placeholder="+91 XXXXXXXXXX"/>
        </div>
        <div className="form-group">
          <label><MapPin size={12} style={{marginRight:5}}/>Location</label>
          <input value={profile.location||''} onChange={e=>setProfile({...profile,location:e.target.value})} placeholder="City, State"/>
        </div>
      </div>

      <div className="form-group">
        <label>About / Bio</label>
        <textarea rows={4} value={profile.bio||''} onChange={e=>setProfile({...profile,bio:e.target.value})}
          placeholder="Tell schools about your teaching philosophy and strengths…"/>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Years of Experience</label>
          <input type="number" min="0" value={profile.experience||0}
            onChange={e=>setProfile({...profile,experience:e.target.value})}/>
        </div>
        <div className="form-group">
          <label>Expected Salary (₹/month)</label>
          <input value={profile.expectedSalary||''} onChange={e=>setProfile({...profile,expectedSalary:e.target.value})}
            placeholder="e.g. ₹40,000–₹60,000"/>
        </div>
      </div>

      <div className="form-group">
        <label><BookOpen size={12} style={{marginRight:5}}/>Subjects You Teach</label>
        <div className="subject-chips-wrap">
          {SUBJECTS.map(s=>(
            <button key={s} type="button"
              className={`chip${profile.subjects?.includes(s)?' selected':''}`}
              onClick={()=>toggleSubject(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{minWidth:160}}>
        {saving?'Saving…':'Save Profile'}
      </button>
    </div>
  );
}
