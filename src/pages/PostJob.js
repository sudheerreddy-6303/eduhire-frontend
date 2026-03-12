import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { PlusCircle, X, BookOpen, MapPin, DollarSign, Users, Calendar, Info } from 'lucide-react';
import './PostJob.css';

const SUBJECTS = [
  'Mathematics','English','Science','Physics','Chemistry','Biology',
  'History','Geography','Computer Science','Physical Education',
  'Art','Music','Hindi','Social Studies','Economics','Accountancy',
  'Commerce','Political Science','Psychology','Sociology'
];

const CLASS_OPTIONS = [
  'Nursery - KG',
  'Class 1 - 2',
  'Class 1 - 5 (Primary)',
  'Class 3 - 5',
  'Class 6 - 8 (Middle)',
  'Class 6 - 10',
  'Class 9 - 10',
  'Class 11 - 12',
  'Class 9 - 12 (Secondary)',
  'All Classes (1 - 12)',
  'UG (Undergraduate)',
  'PG (Postgraduate)',
  'All Levels',
];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', subject: '', classGrade: '', description: '',
    location: '', jobType: 'Full-time',
    salaryMin: '', salaryMax: '',
    experienceRequired: '0', vacancies: '1',
    requirements: [], responsibilities: [],
    applicationDeadline: '',
  });
  const [reqInput,  setReqInput]  = useState('');
  const [respInput, setRespInput] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});

  const setF = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const addItem = (field, input, setInput) => {
    if (!input.trim()) return;
    setForm(p => ({ ...p, [field]: [...p[field], input.trim()] }));
    setInput('');
  };
  const removeItem = (field, idx) =>
    setForm(p => ({ ...p, [field]: p[field].filter((_,i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())            e.title       = 'Job title is required';
    if (!form.subject)                 e.subject     = 'Subject is required';
    if (!form.classGrade)              e.classGrade  = 'Class / Grade is required';
    if (!form.description.trim())      e.description = 'Job description is required';
    if (!form.location.trim())         e.location    = 'Location is required';
    if (!form.salaryMin)               e.salaryMin   = 'Minimum salary is required';
    if (!form.salaryMax)               e.salaryMax   = 'Maximum salary is required';
    if (Number(form.salaryMin) >= Number(form.salaryMax))
                                       e.salaryMax   = 'Max salary must be greater than min salary';
    if (!form.applicationDeadline)     e.applicationDeadline = 'Application deadline is required';
    if (form.requirements.length === 0)   e.requirements   = 'Add at least one requirement';
    if (form.responsibilities.length === 0) e.responsibilities = 'Add at least one responsibility';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill all required fields');
      // Scroll to first error
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        experienceRequired: Number(form.experienceRequired),
        vacancies: Number(form.vacancies),
      };
      await jobsAPI.create(payload);
      toast.success('🎉 Job posted successfully!');
      navigate('/school/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    }
    setLoading(false);
  };

  const Err = ({ field }) => errors[field]
    ? <span className="field-error"><Info size={12}/> {errors[field]}</span>
    : null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Post a New Job</h1>
          <p>Fields marked <span style={{color:'#fbbf4a'}}>*</span> are mandatory</p>
        </div>
      </div>

      <div className="container post-job-container">
        <form onSubmit={handleSubmit} className="post-job-form" noValidate>

          {/* ── Basic Info ── */}
          <div className="card">
            <div className="pj-section-title"><BookOpen size={18}/> Basic Information</div>

            <div className="form-group">
              <label>Job Title <span className="req">*</span></label>
              <input placeholder="e.g. Mathematics Teacher, Physics Lecturer"
                value={form.title} onChange={e => setF('title', e.target.value)}
                className={errors.title ? 'input-error' : ''}/>
              <Err field="title"/>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Subject <span className="req">*</span></label>
                <select value={form.subject} onChange={e => setF('subject', e.target.value)}
                  className={errors.subject ? 'input-error' : ''}>
                  <option value="">— Select Subject —</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Err field="subject"/>
              </div>

              <div className="form-group">
                <label>Class / Grade to Teach <span className="req">*</span></label>
                <select value={form.classGrade} onChange={e => setF('classGrade', e.target.value)}
                  className={errors.classGrade ? 'input-error' : ''}>
                  <option value="">— Select Class Range —</option>
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Err field="classGrade"/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Type <span className="req">*</span></label>
                <select value={form.jobType} onChange={e => setF('jobType', e.target.value)}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Temporary</option>
                </select>
              </div>
              <div className="form-group">
                <label><MapPin size={13}/> Location <span className="req">*</span></label>
                <input placeholder="e.g. New Delhi, Delhi"
                  value={form.location} onChange={e => setF('location', e.target.value)}
                  className={errors.location ? 'input-error' : ''}/>
                <Err field="location"/>
              </div>
            </div>

            <div className="form-group">
              <label>Job Description <span className="req">*</span></label>
              <textarea rows={5}
                placeholder="Describe the role, what's expected, school culture, and any special requirements..."
                value={form.description} onChange={e => setF('description', e.target.value)}
                className={errors.description ? 'input-error' : ''}/>
              <Err field="description"/>
            </div>
          </div>

          {/* ── Compensation ── */}
          <div className="card">
            <div className="pj-section-title"><DollarSign size={18}/> Compensation & Details</div>

            <div className="form-row">
              <div className="form-group">
                <label>Min Salary ₹/month <span className="req">*</span></label>
                <input type="number" min="0" placeholder="e.g. 30000"
                  value={form.salaryMin} onChange={e => setF('salaryMin', e.target.value)}
                  className={errors.salaryMin ? 'input-error' : ''}/>
                <Err field="salaryMin"/>
              </div>
              <div className="form-group">
                <label>Max Salary ₹/month <span className="req">*</span></label>
                <input type="number" min="0" placeholder="e.g. 60000"
                  value={form.salaryMax} onChange={e => setF('salaryMax', e.target.value)}
                  className={errors.salaryMax ? 'input-error' : ''}/>
                <Err field="salaryMax"/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Experience Required (years) <span className="req">*</span></label>
                <input type="number" min="0" value={form.experienceRequired}
                  onChange={e => setF('experienceRequired', e.target.value)}/>
              </div>
              <div className="form-group">
                <label><Users size={13}/> Number of Vacancies <span className="req">*</span></label>
                <input type="number" min="1" value={form.vacancies}
                  onChange={e => setF('vacancies', e.target.value)}/>
              </div>
            </div>

            <div className="form-group" style={{maxWidth:320}}>
              <label><Calendar size={13}/> Application Deadline <span className="req">*</span></label>
              <input type="date" value={form.applicationDeadline}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setF('applicationDeadline', e.target.value)}
                className={errors.applicationDeadline ? 'input-error' : ''}/>
              <Err field="applicationDeadline"/>
            </div>
          </div>

          {/* ── Requirements & Responsibilities ── */}
          <div className="card">
            <div className="pj-section-title"><Info size={18}/> Requirements &amp; Responsibilities</div>

            <div className="form-group">
              <label>Requirements <span className="req">*</span> <span style={{fontWeight:400,color:'var(--text-muted)',fontSize:'.82rem'}}>(add at least one)</span></label>
              <div className="list-input">
                <input placeholder="e.g. B.Ed degree required — press Enter to add"
                  value={reqInput} onChange={e => setReqInput(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addItem('requirements', reqInput, setReqInput))}/>
                <button type="button" className="btn btn-outline btn-sm"
                  onClick={() => addItem('requirements', reqInput, setReqInput)}>
                  <PlusCircle size={14}/> Add
                </button>
              </div>
              <div className="list-items">
                {form.requirements.map((r,i) => (
                  <div key={i} className="list-item">
                    {r}
                    <button type="button" onClick={() => removeItem('requirements',i)}><X size={13}/></button>
                  </div>
                ))}
              </div>
              <Err field="requirements"/>
            </div>

            <div className="form-group">
              <label>Responsibilities <span className="req">*</span> <span style={{fontWeight:400,color:'var(--text-muted)',fontSize:'.82rem'}}>(add at least one)</span></label>
              <div className="list-input">
                <input placeholder="e.g. Prepare and deliver lesson plans — press Enter to add"
                  value={respInput} onChange={e => setRespInput(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addItem('responsibilities', respInput, setRespInput))}/>
                <button type="button" className="btn btn-outline btn-sm"
                  onClick={() => addItem('responsibilities', respInput, setRespInput)}>
                  <PlusCircle size={14}/> Add
                </button>
              </div>
              <div className="list-items">
                {form.responsibilities.map((r,i) => (
                  <div key={i} className="list-item">
                    {r}
                    <button type="button" onClick={() => removeItem('responsibilities',i)}><X size={13}/></button>
                  </div>
                ))}
              </div>
              <Err field="responsibilities"/>
            </div>
          </div>

          <div className="post-job-actions">
            <button type="button" className="btn btn-outline"
              onClick={() => navigate('/school/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Posting…' : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
