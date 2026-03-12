import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI, teacherAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  MapPin, Clock, DollarSign, Users, CheckCircle,
  ArrowLeft, Building2, AlertCircle, FileText, ExternalLink, BookOpen
} from 'lucide-react';
import './JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job,          setJob]          = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [applying,     setApplying]     = useState(false);
  const [applied,      setApplied]      = useState(false);
  const [appliedStatus,setAppliedStatus]= useState(null);
  const [hasResume,    setHasResume]    = useState(null);
  const [coverLetter,  setCoverLetter]  = useState('');
  const [showModal,    setShowModal]    = useState(false);

  useEffect(() => {
    // Load job
    jobsAPI.getById(id)
      .then(({ data }) => { setJob(data); setLoading(false); })
      .catch(() => setLoading(false));

    if (user?.role === 'teacher') {
      // Check resume
      teacherAPI.getProfile()
        .then(({ data }) => setHasResume(!!data.resumeUrl))
        .catch(() => setHasResume(false));
      // Check already applied
      applicationsAPI.checkApplied(id)
        .then(({ data }) => {
          if (data.applied) { setApplied(true); setAppliedStatus(data.status); }
        })
        .catch(() => {});
    }
  }, [id, user]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationsAPI.apply(id, coverLetter);
      setApplied(true);
      setAppliedStatus('pending');
      setShowModal(false);
      toast.success('🎉 Application submitted!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply';
      toast.error(msg);
      if (msg.includes('already applied')) { setApplied(true); setAppliedStatus('pending'); }
    }
    setApplying(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner"/></div>;
  if (!job) return (
    <div className="container" style={{padding:'80px 24px',textAlign:'center'}}>
      <h2>Job not found</h2>
      <Link to="/jobs" className="btn btn-primary" style={{marginTop:20}}>Back to Jobs</Link>
    </div>
  );

  const salary = job.salaryMin && job.salaryMax
    ? `₹${Number(job.salaryMin).toLocaleString('en-IN')} – ₹${Number(job.salaryMax).toLocaleString('en-IN')}/mo`
    : 'Salary not specified';
  const daysAgo = Math.floor((Date.now()-new Date(job.createdAt))/86400000);
  const timeLabel = daysAgo===0?'Today':daysAgo===1?'1 day ago':`${daysAgo} days ago`;
  const requirements      = Array.isArray(job.requirements)           ? job.requirements           : [];
  const responsibilities  = Array.isArray(job.responsibilities)       ? job.responsibilities       : [];
  const qualifications    = Array.isArray(job.qualificationsRequired) ? job.qualificationsRequired : [];

  const STATUS_LABEL = {
    pending:'Under Review',reviewed:'Reviewed',shortlisted:'Shortlisted',
    interview:'Interview Scheduled',accepted:'Accepted 🎉',rejected:'Not Selected'
  };

  return (
    <div>
      {/* Header */}
      <div className="job-detail-header">
        <div className="container">
          <Link to="/jobs" className="back-link"><ArrowLeft size={15}/> Back to Jobs</Link>
          <div className="job-detail-top">
            <div className="job-school-logo">{job.school?.institutionName?.charAt(0)||'S'}</div>
            <div>
              <h1>{job.title}</h1>
              <div className="job-detail-school">
                <Building2 size={14}/>
                <span>{job.school?.institutionName}</span>
                {job.school?.isVerified&&<span className="verified-badge"><CheckCircle size={12}/> Verified</span>}
              </div>
            </div>
          </div>
          <div className="job-detail-meta">
            <span><MapPin size={13}/> {job.location}</span>
            <span><DollarSign size={13}/> {salary}</span>
            {job.classGrade&&<span><BookOpen size={13}/> {job.classGrade}</span>}
            <span><Clock size={13}/> {timeLabel}</span>
            <span><Users size={13}/> {job.applicationsCount||0} applicants</span>
            <span className={`badge ${job.jobType==='Full-time'?'badge-green':'badge-amber'}`}>{job.jobType}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container job-detail-body">

        {/* Main */}
        <div className="job-detail-main">
          <div className="card">
            <h2>Job Description</h2>
            <p>{job.description}</p>

            {responsibilities.length>0&&(
              <><h3>Key Responsibilities</h3>
              <ul>{responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul></>
            )}
            {requirements.length>0&&(
              <><h3>Requirements</h3>
              <ul>{requirements.map((r,i)=><li key={i}>{r}</li>)}</ul></>
            )}
            {qualifications.length>0&&(
              <><h3>Required Qualifications</h3>
              <div className="tags-row">{qualifications.map(q=><span key={q} className="tag">{q}</span>)}</div></>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="job-detail-sidebar">

          {/* Apply card */}
          <div className="card apply-card">
            <h3>Apply for this Position</h3>
            <p>at <strong>{job.school?.institutionName}</strong></p>

            {/* Already applied */}
            {applied && (
              <div className="applied-success">
                <CheckCircle size={17}/>
                <div>
                  <div style={{fontWeight:800}}>Application Submitted</div>
                  {appliedStatus && (
                    <div style={{fontSize:'.8rem',opacity:.85,marginTop:2}}>
                      Status: {STATUS_LABEL[appliedStatus]||appliedStatus}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Not yet applied */}
            {!applied && user?.role==='teacher' && (
              <>
                {hasResume===false && (
                  <div className="resume-warning">
                    <AlertCircle size={13}/>
                    <span>You need to <Link to="/teacher/dashboard">upload your resume</Link> before applying.</span>
                  </div>
                )}
                <button className="btn-apply"
                  disabled={hasResume===false}
                  onClick={()=>setShowModal(true)}>
                  {hasResume===false ? '📄 Upload Resume First' : 'Apply Now'}
                </button>
              </>
            )}

            {!user && (
              <>
                <button className="btn-apply" onClick={()=>toast.info('Please sign in to apply')}>Apply Now</button>
                <p className="apply-note">
                  <Link to="/login">Sign in</Link> or <Link to="/teacher/register">create an account</Link>
                </p>
              </>
            )}
          </div>

          {/* Job Overview */}
          <div className="card">
            <h3>Job Overview</h3>
            <div className="overview-list">
              <div><span>Subject</span><strong>{job.subject}</strong></div>
              {job.classGrade&&<div><span>Class / Grade</span><strong>{job.classGrade}</strong></div>}
              <div><span>Type</span><strong>{job.jobType}</strong></div>
              <div><span>Experience</span><strong>{job.experienceRequired>0?`${job.experienceRequired}+ years`:'Fresher welcome'}</strong></div>
              <div><span>Vacancies</span><strong>{job.vacancies}</strong></div>
              <div><span>Salary</span><strong>{salary}</strong></div>
              {job.applicationDeadline&&(
                <div>
                  <span>Deadline</span>
                  <strong>{new Date(job.applicationDeadline).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</strong>
                </div>
              )}
            </div>
          </div>

          {/* About School */}
          {job.school&&(
            <div className="card school-detail-card">
              <h3>About the School</h3>
              <strong>{job.school.institutionName}</strong>
              {job.school.city&&(
                <p style={{marginTop:6}}><MapPin size={12} style={{display:'inline',marginRight:4}}/>
                  {job.school.city}{job.school.state?`, ${job.school.state}`:''}
                </p>
              )}
              {job.school.description&&<p style={{marginTop:8}}>{job.school.description}</p>}
              {job.school.website&&(
                <a href={job.school.website} target="_blank" rel="noreferrer" className="school-link">
                  <ExternalLink size={12}/> Visit Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showModal&&(
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h2>Apply for {job.title}</h2>
            <p style={{marginBottom:18,color:'var(--text-muted)',fontSize:'.88rem'}}>
              at {job.school?.institutionName}
            </p>
            <div className="modal-resume-note">
              <FileText size={14}/>
              Your uploaded resume will be sent automatically with this application.
            </div>
            <div className="form-group">
              <label>Cover Letter <span style={{color:'var(--text-muted)',fontWeight:400,fontSize:'.82rem'}}>(optional but recommended)</span></label>
              <textarea rows={5}
                placeholder="Tell the school why you're a great fit for this role..."
                value={coverLetter}
                onChange={e=>setCoverLetter(e.target.value)}/>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                {applying?'Submitting…':'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
