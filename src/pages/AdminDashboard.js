import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Building2, Users, Briefcase, CheckCircle,
  XCircle, Clock, Shield, Phone, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';
import './Dashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats,    setStats]    = useState({});
  const [schools,  setSchools]  = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab,setActiveTab]= useState('pending');

  useEffect(()=>{
    Promise.all([
      adminAPI.getStats().catch(()=>({data:{}})),
      adminAPI.getSchools().catch(()=>({data:[]})),
      adminAPI.getTeachers().catch(()=>({data:[]})),
      adminAPI.getJobs().catch(()=>({data:[]})),
    ]).then(([s,sc,t,j])=>{
      setStats(s.data);
      setSchools(sc.data);
      setTeachers(t.data);
      setJobs(j.data);
      setLoading(false);
    });
  },[]);

  const verify = async (id, isVerified) => {
    try {
      await adminAPI.verifySchool(id, isVerified);
      setSchools(p=>p.map(s=>s.id===id?{...s,isVerified}:s));
      setStats(p=>({
        ...p,
        pendingSchools:  isVerified?(p.pendingSchools||1)-1:(p.pendingSchools||0)+1,
        verifiedSchools: isVerified?(p.verifiedSchools||0)+1:(p.verifiedSchools||1)-1,
      }));
      toast.success(isVerified?'✅ School verified! They can now post jobs.':'Verification revoked.');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;

  const pending  = schools.filter(s=>!s.isVerified);
  const verified = schools.filter(s=> s.isVerified);

  return (
    <div>
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-welcome">
            <div className="welcome-avatar" style={{background:'rgba(124,58,237,.3)',border:'2px solid rgba(124,58,237,.5)'}}>
              <Shield size={22}/>
            </div>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Platform management &amp; school verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-body">

        {/* Stats */}
        <div className="admin-stat-cards">
          {[
            { icon:Building2,    val:stats.totalSchools||0,    label:'Total Schools',   bg:'#e6f4ee',color:'#0f5c3e' },
            { icon:AlertTriangle,val:stats.pendingSchools||0,  label:'Pending Verify',  bg:'#fffbeb',color:'#d97706' },
            { icon:CheckCircle,  val:stats.verifiedSchools||0, label:'Verified',        bg:'#e8f0fe',color:'#1a56db' },
            { icon:Users,        val:stats.totalTeachers||0,   label:'Teachers',        bg:'#f3e8ff',color:'#7c3aed' },
            { icon:Briefcase,    val:stats.totalJobs||0,       label:'Jobs Posted',     bg:'#e6f4ee',color:'#0f5c3e' },
          ].map(s=>(
            <div key={s.label} className="admin-stat-card">
              <div className="admin-stat-icon" style={{background:s.bg,color:s.color}}><s.icon size={20}/></div>
              <div><div className="admin-stat-val">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button className={activeTab==='pending'?'active':''} onClick={()=>setActiveTab('pending')} style={{position:'relative'}}>
            Pending ({pending.length})
            {pending.length>0&&<span className="tab-badge">{pending.length}</span>}
          </button>
          <button className={activeTab==='schools'?'active':''} onClick={()=>setActiveTab('schools')}>
            All Schools ({schools.length})
          </button>
          <button className={activeTab==='teachers'?'active':''} onClick={()=>setActiveTab('teachers')}>
            Teachers ({teachers.length})
          </button>
          <button className={activeTab==='jobs'?'active':''} onClick={()=>setActiveTab('jobs')}>
            Jobs ({jobs.length})
          </button>
        </div>

        {activeTab==='pending' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Schools Awaiting Verification</h2>
                <p className="card-header-sub">Call the number below to verify, then click Verify to grant job posting access</p>
              </div>
            </div>
            {pending.length===0
              ? <div className="empty-state"><CheckCircle size={52}/><h3>All schools are verified!</h3></div>
              : <SchoolCards schools={pending} onVerify={verify}/>
            }
          </div>
        )}

        {activeTab==='schools' && (
          <div className="card">
            <div className="card-header"><h2>All Institutions</h2></div>
            <SchoolCards schools={schools} onVerify={verify}/>
          </div>
        )}

        {activeTab==='teachers' && (
          <div className="card">
            <div className="card-header"><h2>Registered Teachers</h2></div>
            {teachers.length===0
              ? <div className="empty-state"><Users size={52}/><h3>No teachers yet</h3></div>
              : <TeacherCards teachers={teachers}/>
            }
          </div>
        )}

        {activeTab==='jobs' && (
          <div className="card">
            <div className="card-header"><h2>All Job Listings</h2></div>
            {jobs.length===0
              ? <div className="empty-state"><Briefcase size={52}/><h3>No jobs yet</h3></div>
              : <JobsList jobs={jobs}/>
            }
          </div>
        )}
      </div>
    </div>
  );
}

/* ── School Cards (mobile-friendly card layout) ── */
function SchoolCards({ schools, onVerify }) {
  return (
    <div className="admin-cards-list">
      {schools.map((s,i) => (
        <div key={s.id} className={`admin-school-card ${s.isVerified?'verified':''}`}>
          <div className="asc-top">
            <div className="asc-logo">{s.institutionName?.charAt(0)}</div>
            <div className="asc-info">
              <div className="asc-name">{s.institutionName}</div>
              <div className="asc-meta">
                <span className="badge badge-blue" style={{fontSize:'.72rem'}}>{s.type}</span>
                {s.city&&<span className="asc-city">{s.city}{s.state?`, ${s.state}`:''}</span>}
                {s.affiliationBoard&&<span className="asc-board">{s.affiliationBoard}</span>}
              </div>
            </div>
            <div className="asc-status">
              {s.isVerified
                ? <span className="badge badge-green"><CheckCircle size={11}/> Verified</span>
                : <span className="badge badge-amber"><Clock size={11}/> Pending</span>
              }
            </div>
          </div>

          {/* Contact row — prominent phone for admin to call */}
          <div className="asc-contact">
            <div className="asc-contact-item">
              <span className="asc-contact-label">Admin:</span>
              <span>{s.user?.name}</span>
            </div>
            <div className="asc-contact-item">
              <span className="asc-contact-label">Email:</span>
              <a href={`mailto:${s.user?.email}`}>{s.user?.email}</a>
            </div>
            {s.phone && (
              <div className="asc-contact-item phone-highlight">
                <Phone size={14}/>
                <a href={`tel:${s.phone}`} className="call-link">{s.phone}</a>
                <span className="call-badge">Tap to call</span>
              </div>
            )}
            {!s.phone && (
              <div className="asc-contact-item" style={{color:'#c62828',fontSize:'.8rem'}}>
                ⚠️ No phone number provided
              </div>
            )}
          </div>

          <div className="asc-footer">
            <span style={{fontSize:'.78rem',color:'var(--text-muted)'}}>
              Registered {new Date(s.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
            </span>
            {s.isVerified
              ? <button className="verify-btn revoke" onClick={()=>onVerify(s.id,false)}>
                  <XCircle size={13}/> Revoke
                </button>
              : <button className="verify-btn approve" onClick={()=>onVerify(s.id,true)}>
                  <CheckCircle size={13}/> Verify & Allow Jobs
                </button>
            }
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Teacher Cards ── */
function TeacherCards({ teachers }) {
  return (
    <div className="admin-cards-list">
      {teachers.map(t => (
        <div key={t.id} className="admin-teacher-card">
          <div className="atc-avatar">{t.user?.name?.charAt(0)}</div>
          <div className="atc-info">
            <div className="atc-name">{t.user?.name}</div>
            <div className="atc-email">{t.user?.email}</div>
            <div className="atc-meta">
              {t.location&&<span>📍 {t.location}</span>}
              {t.experience>0&&<span>⏱ {t.experience} yrs</span>}
              {t.phone&&<span>📞 {t.phone}</span>}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
              {(t.subjects||[]).slice(0,4).map(s=>(
                <span key={s} className="badge badge-green" style={{fontSize:'.72rem'}}>{s}</span>
              ))}
              {(t.subjects||[]).length>4&&<span style={{fontSize:'.72rem',color:'var(--text-muted)'}}>+{t.subjects.length-4}</span>}
            </div>
          </div>
          <div className="atc-right">
            {t.resumeUrl
              ? <a href={`https://eduhire-backen.onrender.com${t.resumeUrl}`} target="_blank" rel="noreferrer"
                  className="btn btn-outline btn-sm" style={{fontSize:'.78rem'}}>📄 Resume</a>
              : <span style={{fontSize:'.76rem',color:'var(--text-muted)',background:'var(--bg)',padding:'4px 10px',borderRadius:8}}>No resume</span>
            }
            <div style={{fontSize:'.74rem',color:'var(--text-muted)',marginTop:6,textAlign:'right'}}>
              {new Date(t.user?.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Jobs List ── */
function JobsList({ jobs }) {
  return (
    <div className="admin-cards-list">
      {jobs.map(j => (
        <div key={j.id} className="admin-job-card">
          <div className="ajc-left">
            <div className="ajc-title">{j.title}</div>
            <div className="ajc-meta">
              <span>🏫 {j.school?.institutionName}</span>
              <span>📍 {j.location}</span>
              {j.classGrade&&<span>📚 {j.classGrade}</span>}
              <span className={`badge ${j.jobType==='Full-time'?'badge-green':'badge-amber'}`} style={{fontSize:'.72rem'}}>{j.jobType}</span>
            </div>
            <div className="ajc-salary">
              {j.salaryMin&&j.salaryMax
                ? `₹${Number(j.salaryMin).toLocaleString('en-IN')} – ₹${Number(j.salaryMax).toLocaleString('en-IN')}/mo`
                : 'Salary not listed'}
            </div>
          </div>
          <div className="ajc-right">
            <span className={`badge ${j.status==='active'?'badge-green':'badge-gray'}`}>{j.status}</span>
            <div className="ajc-apps">{j.applicationsCount||0} applications</div>
            <div style={{fontSize:'.74rem',color:'var(--text-muted)'}}>
              {new Date(j.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
