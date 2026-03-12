import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolAPI, jobsAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Briefcase, Users, PlusCircle, Eye, Trash2,
  ArrowLeft, MapPin, Phone, Mail, BookOpen,
  Clock, FileText, Download, CheckCircle, AlertTriangle, XCircle
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

export default function SchoolDashboard() {
  const { user } = useAuth();
  const [stats, setStats]           = useState({});
  const [jobs, setJobs]             = useState([]);
  const [profile, setProfile]       = useState(null);
  const [applications, setApplications] = useState({});   // keyed by jobId
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('jobs');
  const [selectedJob, setSelectedJob]         = useState(null);  // job object
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    Promise.all([
      schoolAPI.getStats().catch(()=>({data:{}})),
      jobsAPI.getMyJobs().catch(()=>({data:[]})),
      schoolAPI.getProfile().catch(()=>({data:null}))
    ]).then(([s,j,p])=>{
      setStats(s.data);
      setJobs(j.data||[]);
      setProfile(p.data);
      setLoading(false);
    });
  }, []);

  const deleteJob = async id => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await jobsAPI.delete(id);
      setJobs(j=>j.filter(x=>x.id!==id));
      toast.success('Job deleted');
    } catch(err){ toast.error(err.response?.data?.message||'Failed'); }
  };

  const loadApplications = async job => {
    setSelectedJob(job);
    setSelectedApplicant(null);
    setActiveTab('applications');
    if (!applications[job.id]) {
      try {
        const { data } = await applicationsAPI.getJobApplications(job.id);
        setApplications(p=>({...p,[job.id]:data}));
      } catch { toast.error('Failed to load applications'); }
    }
  };

  const updateStatus = async (appId, status) => {
    if (!selectedJob) return;
    try {
      await applicationsAPI.updateStatus(appId, { status });
      setApplications(p=>({
        ...p,
        [selectedJob.id]: p[selectedJob.id].map(a=>a.id===appId?{...a,status}:a)
      }));
      if (selectedApplicant?.id===appId) setSelectedApplicant(p=>({...p,status}));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;

  const verified   = profile?.isVerified;
  const currentApps = selectedJob ? (applications[selectedJob.id]||[]) : [];

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-welcome">
            <div className="welcome-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <h1>School Dashboard</h1>
              <p>{profile?.institutionName||'Manage jobs & applications'}</p>
            </div>
          </div>
          {verified
            ? <Link to="/school/post-job" className="btn btn-accent"><PlusCircle size={15}/> Post New Job</Link>
            : <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.15)',padding:'10px 18px',borderRadius:12}}>
                <AlertTriangle size={15}/><span style={{fontSize:'.86rem',fontWeight:700}}>Pending Verification</span>
              </div>
          }
        </div>
      </div>

      <div className="container dashboard-body">

        {/* Verification banner */}
        {!verified && (
          <div className="verify-banner">
            <div className="verify-banner-icon">⏳</div>
            <div>
              <h3>Awaiting Admin Verification</h3>
              <p>
                Once an admin verifies your institution you'll be able to post jobs and receive applications.
                This usually takes 24–48 hours. Make sure your institution profile is complete.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="stats-cards">
          {[
            { icon:Briefcase, value:stats.activeJobs||0,        label:'Active Jobs',         color:'green'  },
            { icon:Users,     value:stats.totalApplications||0, label:'Total Applications',   color:'blue'   },
            { icon:Eye,       value:stats.pending||0,           label:'Pending Review',       color:'amber'  },
            { icon:Briefcase, value:stats.totalJobs||0,         label:'Total Jobs Posted',    color:'purple' },
          ].map(s=>(
            <div key={s.label} className={`stat-card stat-${s.color}`}>
              <s.icon size={24}/>
              <div className="stat-card-num">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button className={activeTab==='jobs'?'active':''}
            onClick={()=>{setActiveTab('jobs');setSelectedJob(null);setSelectedApplicant(null);}}>
            My Jobs ({jobs.length})
          </button>
          {selectedJob && (
            <button className={activeTab==='applications'?'active':''}
              onClick={()=>{setActiveTab('applications');setSelectedApplicant(null);}}>
              Applications ({currentApps.length})
            </button>
          )}
          {selectedApplicant && (
            <button className={activeTab==='applicant'?'active':''} onClick={()=>setActiveTab('applicant')}>
              👤 Applicant Detail
            </button>
          )}
          <button className={activeTab==='profile'?'active':''} onClick={()=>setActiveTab('profile')}>
            Institution Profile
          </button>
        </div>

        {/* ── JOBS ── */}
        {activeTab==='jobs' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Job Listings</h2>
                {!verified && <p className="card-header-sub">Verification required to post jobs</p>}
              </div>
              {verified && (
                <Link to="/school/post-job" className="btn btn-primary btn-sm">
                  <PlusCircle size={13}/> Post Job
                </Link>
              )}
            </div>
            {jobs.length===0 ? (
              <div className="empty-state">
                <Briefcase size={52}/>
                <h3>{verified?'No Jobs Posted Yet':'Verification Required'}</h3>
                <p>{verified
                  ? 'Post your first job to start receiving applications from qualified teachers.'
                  : 'Your school must be verified by an admin before you can post jobs.'}</p>
                {verified && (
                  <div className="empty-actions">
                    <Link to="/school/post-job" className="btn btn-primary btn-sm">Post a Job</Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="applications-list">
                {jobs.map(job=>(
                  <div key={job.id} className="application-item">
                    <div className="app-logo" style={{background:'linear-gradient(135deg,#1a56db,#3b82f6)'}}>
                      {job.title?.charAt(0)}
                    </div>
                    <div className="app-info">
                      <div className="app-title">{job.title}</div>
                      <div className="app-school">{job.subject} &bull; {job.location} &bull; {job.jobType}</div>
                      <div className="app-date">
                        <Users size={11}/> {job.applicationsCount||0} application{job.applicationsCount!==1?'s':''}
                        &nbsp;&bull;&nbsp;Posted {new Date(job.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      <span className={`badge ${job.status==='active'?'badge-green':'badge-gray'}`}>{job.status}</span>
                      <button className="btn btn-outline btn-sm" onClick={()=>loadApplications(job)}>
                        <Users size={13}/> View
                      </button>
                      <button onClick={()=>deleteJob(job.id)}
                        style={{background:'#fce8e8',color:'#c62828',border:'none',borderRadius:8,padding:'7px 10px',cursor:'pointer',display:'flex',alignItems:'center'}}>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICATIONS LIST ── */}
        {activeTab==='applications' && selectedJob && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Applications — {selectedJob.title}</h2>
                <p className="card-header-sub">
                  {currentApps.length} applicant{currentApps.length!==1?'s':''} &nbsp;·&nbsp; Click a row to view full details
                </p>
              </div>
              <button className="btn btn-outline btn-sm"
                onClick={()=>{setActiveTab('jobs');setSelectedJob(null);}}>
                <ArrowLeft size={13}/> Back
              </button>
            </div>
            {currentApps.length===0 ? (
              <div className="empty-state">
                <Users size={52}/>
                <h3>No Applications Yet</h3>
                <p>Applications will appear here once teachers apply.</p>
              </div>
            ) : (
              <div className="applications-list">
                {currentApps.map(app=>(
                  <div key={app.id} className="application-item clickable"
                    onClick={()=>{setSelectedApplicant(app);setActiveTab('applicant');}}>
                    <div className="app-logo">{app.teacher?.user?.name?.charAt(0)?.toUpperCase()||'T'}</div>
                    <div className="app-info">
                      <div className="app-title">{app.teacher?.user?.name}</div>
                      <div className="app-school">
                        <Mail size={11}/> {app.teacher?.user?.email}
                        {app.teacher?.location && <><span> &bull; </span><MapPin size={11}/> {app.teacher.location}</>}
                      </div>
                      <div className="app-date">
                        {app.teacher?.experience>0 && <span>{app.teacher.experience} yrs exp &bull; </span>}
                        Applied {new Date(app.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                        {app.teacher?.resumeUrl && <span className="app-resume-tag"> &bull; 📄 Resume</span>}
                      </div>
                    </div>
                    <div className="app-status">
                      <span className={`badge ${STATUS[app.status]?.cls||'badge-gray'}`}>
                        {STATUS[app.status]?.label||app.status}
                      </span>
                      <span className="app-hint">View details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICANT DETAIL ── */}
        {activeTab==='applicant' && selectedApplicant && (
          <ApplicantDetail
            app={selectedApplicant}
            onBack={()=>setActiveTab('applications')}
            onStatusChange={status=>updateStatus(selectedApplicant.id,status)}
          />
        )}

        {/* ── PROFILE ── */}
        {activeTab==='profile' && <SchoolProfileForm/>}
      </div>
    </div>
  );
}

/* ──────────── Applicant Detail ──────────── */
function ApplicantDetail({ app, onBack, onStatusChange }) {
  const t = app.teacher || {};
  const u = t.user || {};
  const [status, setStatus] = useState(app.status);

  const onChange = e => {
    const v = e.target.value;
    setStatus(v);
    onStatusChange(v);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Applicant Details</h2>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={13}/> Back to List
        </button>
      </div>

      <div className="applicant-panel">

        {/* Header row */}
        <div className="applicant-panel-header">
          <div className="applicant-big-avatar">{u.name?.charAt(0)?.toUpperCase()||'T'}</div>
          <div style={{flex:1}}>
            <div className="applicant-name">{u.name}</div>
            <div className="applicant-email">{u.email}</div>
            <div className="applicant-meta">
              {t.phone    && <span><Phone size={13}/> {t.phone}</span>}
              {t.location && <span><MapPin size={13}/> {t.location}</span>}
              {t.experience>0 && <span><Clock size={13}/> {t.experience} yrs experience</span>}
            </div>
          </div>
          <span className={`badge ${STATUS[status]?.cls||'badge-gray'}`} style={{fontSize:'.84rem',padding:'6px 16px'}}>
            {STATUS[status]?.label||status}
          </span>
        </div>

        {/* Subjects */}
        {(t.subjects||[]).length>0 && (
          <div className="detail-section">
            <h4><BookOpen size={13}/> Subjects</h4>
            <div className="subject-tags">
              {t.subjects.map(s=><span key={s} className="subject-tag-sm">{s}</span>)}
            </div>
          </div>
        )}

        {/* Bio */}
        {t.bio && (
          <div className="detail-section">
            <h4><Eye size={13}/> About</h4>
            <p>{t.bio}</p>
          </div>
        )}

        {/* Expected Salary */}
        {t.expectedSalary && (
          <div className="detail-section">
            <h4>💰 Expected Salary</h4>
            <p style={{fontWeight:800,color:'var(--primary)',fontSize:'1rem'}}>{t.expectedSalary}</p>
          </div>
        )}

        {/* Cover Letter */}
        {app.coverLetter && (
          <div className="detail-section">
            <h4>✉️ Cover Letter</h4>
            <div className="cover-letter-box">"{app.coverLetter}"</div>
          </div>
        )}

        {/* Resume */}
        <div className="detail-section">
          <h4><FileText size={13}/> Resume</h4>
          {t.resumeUrl
            ? <a href={`https://eduhire-backen.onrender.com${t.resumeUrl}`} target="_blank" rel="noreferrer" className="resume-download-btn">
                <Download size={16}/> Download / View Resume
              </a>
            : <div className="no-resume-note"><AlertTriangle size={14}/> No resume uploaded by this teacher.</div>
          }
        </div>

        {/* Status update */}
        <div className="detail-section">
          <h4>📋 Update Application Status</h4>
          <div className="status-update-row">
            <label>Status:</label>
            <select className="status-select" value={status} onChange={onChange}>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Invite to Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="status-auto-save">✓ Saves automatically</span>
          </div>
        </div>

        <p className="applied-at">
          Applied on {new Date(app.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
        </p>
      </div>
    </div>
  );
}

/* ──────────── School Profile Form ──────────── */
function SchoolProfileForm() {
  const [profile, setProfile] = useState({
    institutionName:'',description:'',website:'',
    phone:'',address:'',city:'',state:'',
    affiliationBoard:'',establishedYear:''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    schoolAPI.getProfile()
      .then(({data})=>{ setProfile(p=>({...p,...data})); setLoading(false); })
      .catch(()=>setLoading(false));
  },[]);

  const save = async () => {
    setSaving(true);
    try { await schoolAPI.updateProfile(profile); toast.success('Profile updated!'); }
    catch { toast.error('Failed to update'); }
    setSaving(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;

  const f = (k,v) => setProfile(p=>({...p,[k]:v}));

  return (
    <div className="card">
      <div className="card-header"><h2>Institution Profile</h2></div>
      <p style={{fontSize:'.86rem',color:'var(--text-muted)',marginBottom:22,lineHeight:1.6}}>
        Keep your institution profile complete and accurate — teachers use this to decide where to apply.
      </p>

      <div className="form-group">
        <label>Institution Name</label>
        <input value={profile.institutionName||''} onChange={e=>f('institutionName',e.target.value)}/>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows={4} value={profile.description||''} onChange={e=>f('description',e.target.value)}
          placeholder="Tell teachers about your school's culture, achievements and values…"/>
      </div>
      <div className="form-row">
        <div className="form-group"><label>City</label>
          <input value={profile.city||''} onChange={e=>f('city',e.target.value)}/></div>
        <div className="form-group"><label>State</label>
          <input value={profile.state||''} onChange={e=>f('state',e.target.value)}/></div>
      </div>
      <div className="form-group"><label>Full Address</label>
        <input value={profile.address||''} onChange={e=>f('address',e.target.value)} placeholder="Street address"/></div>
      <div className="form-row">
        <div className="form-group"><label>Website</label>
          <input value={profile.website||''} onChange={e=>f('website',e.target.value)} placeholder="https://yourschool.edu"/></div>
        <div className="form-group"><label>Phone</label>
          <input value={profile.phone||''} onChange={e=>f('phone',e.target.value)}/></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Affiliation Board (e.g. CBSE, ICSE, IB)</label>
          <input value={profile.affiliationBoard||''} onChange={e=>f('affiliationBoard',e.target.value)}/></div>
        <div className="form-group"><label>Established Year</label>
          <input type="number" value={profile.establishedYear||''} onChange={e=>f('establishedYear',e.target.value)} placeholder="e.g. 1985"/></div>
      </div>

      <button className="btn btn-primary" onClick={save} disabled={saving} style={{minWidth:160}}>
        {saving?'Saving…':'Save Profile'}
      </button>
    </div>
  );
}
