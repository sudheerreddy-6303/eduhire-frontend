import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import JobCard from '../components/JobCard';
import { Search, SlidersHorizontal, X, ArrowLeft, ArrowRight } from 'lucide-react';
import './Jobs.css';

const SUBJECTS = [
  'Mathematics','English','Science','Physics','Chemistry',
  'Biology','History','Geography','Computer Science',
  'Physical Education','Art','Music','Hindi','Social Studies','Economics'
];
const JOB_TYPES = ['Full-time','Part-time','Contract','Temporary'];

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search:    searchParams.get('search')   || '',
    subject:   searchParams.get('subject')  || '',
    location:  searchParams.get('location') || '',
    jobType:   '',
    minSalary: '',
    maxSalary: '',
  });

  const fetchJobs = async (f = filters, p = page) => {
    setLoading(true);
    try {
      const { data } = await jobsAPI.getAll({ ...f, page: p, limit: 10 });
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchJobs(filters, page); }, [page]);

  const applyFilters = e => {
    e?.preventDefault();
    setPage(1);
    fetchJobs(filters, 1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const empty = { search:'',subject:'',location:'',jobType:'',minSalary:'',maxSalary:'' };
    setFilters(empty);
    setPage(1);
    fetchJobs(empty, 1);
  };

  const setF = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  return (
    <div>
      {/* Header */}
      <div className="jobs-page-header">
        <div className="container">
          <h1>Browse Teaching Jobs</h1>
          <p>{loading ? 'Loading…' : `${total} opportunities across India`}</p>
        </div>
      </div>

      <div className="container jobs-layout">

        {/* ── Filters Sidebar ── */}
        <aside className={`filters-sidebar${showFilters?' open':''}`}>
          {/* Mobile close */}
          <button className="close-filters-btn" onClick={()=>setShowFilters(false)}>
            <ArrowLeft size={16}/> Close Filters
          </button>

          <div className="filters-header">
            <h3>Filters</h3>
            <button className="btn-icon" onClick={clearFilters}><X size={14}/> Clear</button>
          </div>

          <form onSubmit={applyFilters}>
            <div className="filter-group form-group">
              <label>Search</label>
              <div className="search-input-wrap">
                <Search size={15}/>
                <input type="text" placeholder="Title, subject…"
                  value={filters.search} onChange={e=>setF('search',e.target.value)}/>
              </div>
            </div>

            <div className="filter-group form-group">
              <label>Subject</label>
              <select value={filters.subject} onChange={e=>setF('subject',e.target.value)}>
                <option value="">All Subjects</option>
                {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="filter-group form-group">
              <label>Location</label>
              <input type="text" placeholder="City, state…"
                value={filters.location} onChange={e=>setF('location',e.target.value)}/>
            </div>

            <div className="filter-group form-group">
              <label>Job Type</label>
              <select value={filters.jobType} onChange={e=>setF('jobType',e.target.value)}>
                <option value="">All Types</option>
                {JOB_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label style={{display:'block',fontWeight:700,fontSize:'.8rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>
                Salary (₹/month)
              </label>
              <div className="salary-row">
                <div className="form-group" style={{margin:0}}>
                  <input type="number" placeholder="Min" value={filters.minSalary}
                    onChange={e=>setF('minSalary',e.target.value)}/>
                </div>
                <div className="form-group" style={{margin:0}}>
                  <input type="number" placeholder="Max" value={filters.maxSalary}
                    onChange={e=>setF('maxSalary',e.target.value)}/>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:4}}>
              <Search size={15}/> Apply Filters
            </button>
          </form>
        </aside>

        {/* ── Jobs Main ── */}
        <div className="jobs-main">
          <div className="jobs-toolbar">
            <p className="jobs-count">
              {loading ? 'Loading…' : `${total} job${total!==1?'s':''} found`}
            </p>
            <button className="btn btn-outline btn-sm show-filters-btn"
              onClick={()=>setShowFilters(true)}>
              <SlidersHorizontal size={15}/> Filters
            </button>
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner"/></div>
          ) : jobs.length > 0 ? (
            <>
              <div className="jobs-grid">
                {jobs.map(job=><JobCard key={job.id} job={job}/>)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  <button className="btn btn-outline btn-sm"
                    disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                    <ArrowLeft size={14}/> Prev
                  </button>
                  <span className="pagination-info">Page {page} of {pages}</span>
                  <button className="btn btn-outline btn-sm"
                    disabled={page===pages} onClick={()=>setPage(p=>p+1)}>
                    Next <ArrowRight size={14}/>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="jobs-empty">
              <Search size={48}/>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or check back soon for new opportunities.</p>
              <button className="btn btn-outline btn-sm" style={{marginTop:16}} onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {showFilters && (
        <div onClick={()=>setShowFilters(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:299}}/>
      )}
    </div>
  );
}
