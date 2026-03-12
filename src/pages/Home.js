import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import JobCard from '../components/JobCard';
import {
  Search, MapPin, ChevronRight, Users, Building2, Briefcase,
  TrendingUp, Shield, Zap, MousePointerClick, ArrowRight,
  BookOpen, Star, CheckCircle, Award, Globe, Clock,
  GraduationCap, Heart, Sparkles, Play, Quote
} from 'lucide-react';
import './Home.css';

const STATS = [
  { value: '10,000+', label: 'Active Teachers', icon: Users, color: '#0f5c3e' },
  { value: '2,500+', label: 'Verified Schools', icon: Building2, color: '#1a56db' },
  { value: '5,000+', label: 'Jobs Posted', icon: Briefcase, color: '#c77700' },
  { value: '98%', label: 'Success Rate', icon: TrendingUp, color: '#e91e8c' },
];

const SUBJECTS = [
  { name: 'Mathematics', emoji: '📐', count: '340+' },
  { name: 'Science', emoji: '🔬', count: '280+' },
  { name: 'English', emoji: '📚', count: '420+' },
  { name: 'Physics', emoji: '⚛️', count: '190+' },
  { name: 'Computer Science', emoji: '💻', count: '250+' },
  { name: 'Chemistry', emoji: '🧪', count: '160+' },
  { name: 'Biology', emoji: '🧬', count: '140+' },
  { name: 'History', emoji: '🏛️', count: '110+' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Mathematics Teacher', school: 'Placed at DPS Noida', text: 'EduHire made my job search completely stress-free. I received interview calls within 48 hours of completing my profile. The platform is intuitive and the schools are all verified.', rating: 5, avatar: 'P' },
  { name: 'Rajesh Kumar', role: 'Physics Lecturer', school: 'Placed at NIT Bangalore', text: 'As someone looking for a senior position, I was impressed by the quality of institutions on EduHire. The salary filters helped me find roles that matched my expectations perfectly.', rating: 5, avatar: 'R' },
  { name: 'Anita Nair', role: 'English Teacher', school: 'Placed at St. Mary\'s', text: 'The application process is so seamless. I could apply to 10 jobs in under an hour. Within 2 weeks I had my dream job. I recommend EduHire to every educator I know!', rating: 5, avatar: 'A' },
];

const CITIES = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow'];

const FEATURES = [
  { icon: Shield, title: 'Verified Institutions', desc: 'Every school and college undergoes thorough background verification. No fake listings, ever.', stat: '100% verified' },
  { icon: Zap, title: 'AI-Powered Matching', desc: 'Our smart algorithm connects you with roles that match your qualifications, experience and salary goals.', stat: '3x faster hiring' },
  { icon: MousePointerClick, title: 'One-Click Apply', desc: 'Build your profile once and apply to hundreds of positions instantly with your saved documents.', stat: '10k+ easy applies' },
  { icon: Globe, title: 'Pan-India Reach', desc: 'Opportunities in 200+ cities across India — from metro schools to top-tier universities.', stat: '200+ cities' },
  { icon: Award, title: 'Top Institutions', desc: 'CBSE, ICSE, IB, and state board schools all in one place. Find roles at India\'s best institutions.', stat: '2,500+ schools' },
  { icon: Heart, title: 'Career Support', desc: 'Get resume tips, interview guidance, and salary insights from education industry experts.', stat: 'Free for teachers' },
];

const HOW_TEACHER = [
  { n: '01', title: 'Create Your Profile', desc: 'Build a detailed profile with your qualifications, subjects, and experience. Upload your resume and portfolio.' },
  { n: '02', title: 'Browse & Filter Jobs', desc: 'Search teaching positions by subject, location, salary and institution type. Save your favorites.' },
  { n: '03', title: 'Apply in Seconds', desc: 'One-click apply using your saved profile. Add a cover letter to stand out from the crowd.' },
  { n: '04', title: 'Get Hired!', desc: 'Interview with top schools and receive your offer. Our team is here if you need support.' },
];

const HOW_SCHOOL = [
  { n: '01', title: 'Register & Verify', desc: 'Submit your institution details. Our team verifies your school within 24 hours.' },
  { n: '02', title: 'Post Job Openings', desc: 'Create detailed listings with salary range, requirements and responsibilities.' },
  { n: '03', title: 'Review Applications', desc: 'Browse teacher profiles, read cover letters, and shortlist top candidates.' },
  { n: '04', title: 'Hire the Best!', desc: 'Schedule interviews directly through the platform and make your offer.' },
];

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [count, setCount] = useState({ teachers: 0, schools: 0, jobs: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.getAll({ limit: 6 }).then(({ data }) => {
      setFeaturedJobs(data.jobs || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Animate counters
    const targets = { teachers: 10000, schools: 2500, jobs: 5000 };
    const duration = 2000;
    const steps = 60;
    const increment = { teachers: targets.teachers / steps, schools: targets.schools / steps, jobs: targets.jobs / steps };
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount({
        teachers: Math.min(Math.round(increment.teachers * step), targets.teachers),
        schools: Math.min(Math.round(increment.schools * step), targets.schools),
        jobs: Math.min(Math.round(increment.jobs * step), targets.jobs),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home">

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-mesh" />
        <div className="hero-dots" />
        <div className="container hero-container">
          <div className="hero-left">
            <div className="hero-pill">
              <Sparkles size={13} />
              <span>India's #1 Teacher Recruitment Platform</span>
            </div>
            <h1 className="hero-title">
              Find Your Perfect
              <span className="hero-highlight"> Teaching</span>
              <br />Position Today
            </h1>
            <p className="hero-desc">
              Connect with 2,500+ verified schools and colleges across India.
              Whether you're a fresh graduate or a seasoned educator — your next great opportunity is here.
            </p>

            {/* Search Bar */}
            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-field">
                <Search size={17} className="search-icon" />
                <input
                  type="text"
                  placeholder="Job title or subject..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="search-divider" />
              <div className="search-field">
                <MapPin size={17} className="search-icon" />
                <input
                  type="text"
                  placeholder="City or state..."
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="search-btn">
                <Search size={18} /> Search Jobs
              </button>
            </form>

            <div className="hero-tags">
              <span>Popular:</span>
              {['Mathematics', 'Computer Science', 'Physics', 'English'].map(s => (
                <Link key={s} to={`/jobs?subject=${s}`} className="hero-tag">{s}</Link>
              ))}
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                {['R','P','A','M','K'].map((l,i) => <div key={i} className="trust-avatar" style={{background: ['#0f5c3e','#1a56db','#c77700','#e91e8c','#22a06b'][i]}}>{l}</div>)}
              </div>
              <p><strong>10,000+ teachers</strong> found jobs through EduHire</p>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-visual">
              {/* Main card */}
              <div className="vis-main-card">
                <div className="vis-card-top">
                  <div className="vis-school-logo">DPS</div>
                  <div>
                    <div className="vis-job-title">Mathematics Teacher</div>
                    <div className="vis-job-school">Delhi Public School • New Delhi</div>
                  </div>
                  <span className="badge badge-green">Active</span>
                </div>
                <div className="vis-card-details">
                  <span>📍 New Delhi</span>
                  <span>💰 ₹45k–60k/mo</span>
                  <span>🕒 Full-time</span>
                </div>
                <div className="vis-card-footer">
                  <span className="vis-applicants">👥 24 applicants</span>
                  <button className="vis-apply-btn">Quick Apply →</button>
                </div>
              </div>

              {/* Floating notifications */}
              <div className="vis-notif notif-1">
                <div className="notif-icon">🎉</div>
                <div>
                  <div className="notif-title">Application Accepted!</div>
                  <div className="notif-sub">St. Xavier's invited you for interview</div>
                </div>
              </div>

              <div className="vis-notif notif-2">
                <div className="notif-icon">🔔</div>
                <div>
                  <div className="notif-title">New Job Alert</div>
                  <div className="notif-sub">Physics Lecturer • NIT Bangalore</div>
                </div>
              </div>

              <div className="vis-notif notif-3">
                <div className="notif-icon">👁️</div>
                <div>
                  <div className="notif-title">Profile Views</div>
                  <div className="notif-sub">Viewed 24 times this week</div>
                </div>
              </div>

              {/* Stats pill */}
              <div className="vis-stats-pill">
                <div className="vis-stat">
                  <span className="vis-stat-num">{count.jobs.toLocaleString()}+</span>
                  <span className="vis-stat-label">Jobs</span>
                </div>
                <div className="vis-stat-divider" />
                <div className="vis-stat">
                  <span className="vis-stat-num">{count.schools.toLocaleString()}+</span>
                  <span className="vis-stat-label">Schools</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f7f9f8"/></svg>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-row">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="stat-box">
                <div className="stat-box-icon" style={{ background: color + '18', color }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="stat-box-value">{value}</div>
                  <div className="stat-box-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BROWSE BY SUBJECT ─── */}
      <section className="section subjects-section">
        <div className="container">
          <div className="text-center">
            <div className="section-eyebrow"><BookOpen size={14} /> Browse by Subject</div>
            <h2 className="section-title">Find Jobs in Your Specialty</h2>
            <p className="section-subtitle">Explore hundreds of teaching opportunities across every subject and grade level.</p>
          </div>
          <div className="subjects-grid">
            {SUBJECTS.map(({ name, emoji, count }) => (
              <Link key={name} to={`/jobs?subject=${name}`} className="subject-card">
                <span className="subject-emoji">{emoji}</span>
                <div className="subject-name">{name}</div>
                <div className="subject-count">{count} jobs</div>
                <ArrowRight size={14} className="subject-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED JOBS ─── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow"><Briefcase size={14} /> Latest Openings</div>
              <h2 className="section-title">Featured Teaching Jobs</h2>
              <p className="section-subtitle">Hand-picked opportunities from India's top schools and colleges</p>
            </div>
            <Link to="/jobs" className="btn btn-outline">View All Jobs <ArrowRight size={16} /></Link>
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : (
            <div className="jobs-grid-home">
              {featuredJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}

          <div className="text-center" style={{ marginTop: 48 }}>
            <Link to="/jobs" className="btn btn-primary btn-lg">
              Explore All Jobs <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section how-section">
        <div className="container">
          <div className="text-center">
            <div className="section-eyebrow"><GraduationCap size={14} /> Simple Process</div>
            <h2 className="section-title">How EduHire Works</h2>
            <p className="section-subtitle">From profile to placement in just a few simple steps — for both teachers and institutions.</p>
          </div>

          <div className="how-tabs-content">
            <div className="how-panel">
              <div className="how-panel-label for-teachers">🎓 For Teachers</div>
              <div className="how-steps">
                {HOW_TEACHER.map((step, i) => (
                  <div key={i} className="how-step">
                    <div className="step-num-big">{step.n}</div>
                    <div className="step-line" />
                    <div className="step-content">
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/teacher/register" className="btn btn-primary btn-lg">
                Create Free Profile <ArrowRight size={18} />
              </Link>
            </div>

            <div className="how-divider" />

            <div className="how-panel">
              <div className="how-panel-label for-schools">🏫 For Schools</div>
              <div className="how-steps">
                {HOW_SCHOOL.map((step, i) => (
                  <div key={i} className="how-step">
                    <div className="step-num-big school">{step.n}</div>
                    <div className="step-line school" />
                    <div className="step-content">
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/school/register" className="btn btn-accent btn-lg">
                Register Institution <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOP CITIES ─── */}
      <section className="cities-section">
        <div className="container">
          <div className="cities-inner">
            <div>
              <div className="section-eyebrow"><MapPin size={14} /> Pan-India Reach</div>
              <h2 className="section-title">Jobs Across India</h2>
              <p className="section-subtitle">Teaching opportunities in every major city and beyond.</p>
            </div>
            <div className="cities-grid">
              {CITIES.map(city => (
                <Link key={city} to={`/jobs?location=${city}`} className="city-chip">
                  <MapPin size={13} /> {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="section features-section">
        <div className="container">
          <div className="text-center">
            <div className="section-eyebrow"><Star size={14} /> Why EduHire</div>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">We've built EduHire from the ground up for the education sector — not as an afterthought.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(({ icon: Icon, title, desc, stat }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon-wrap">
                  <Icon size={24} />
                </div>
                <div className="feature-stat">{stat}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="text-center">
            <div className="section-eyebrow"><Quote size={14} /> Success Stories</div>
            <h2 className="section-title">Teachers Love EduHire</h2>
            <p className="section-subtitle">Don't take our word for it — hear from educators who found their dream positions.</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#f5a623" color="#f5a623" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role} • {t.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SPLIT ─── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-card cta-teacher">
              <div className="cta-icon">🎓</div>
              <h2>I'm a Teacher</h2>
              <p>Join 10,000+ educators who found their perfect position through EduHire. Create your free profile and start applying today.</p>
              <ul className="cta-list">
                <li><CheckCircle size={16} /> Free to join, always</li>
                <li><CheckCircle size={16} /> Apply to unlimited jobs</li>
                <li><CheckCircle size={16} /> Get discovered by schools</li>
                <li><CheckCircle size={16} /> Interview scheduling support</li>
              </ul>
              <Link to="/teacher/register" className="btn btn-white btn-lg">
                Create Free Profile <ArrowRight size={18} />
              </Link>
            </div>

            <div className="cta-card cta-school">
              <div className="cta-icon">🏫</div>
              <h2>I'm a School</h2>
              <p>Find qualified, passionate educators for your institution. Post jobs, review applications, and hire the best talent.</p>
              <ul className="cta-list">
                <li><CheckCircle size={16} /> Verified teacher profiles</li>
                <li><CheckCircle size={16} /> Post unlimited job listings</li>
                <li><CheckCircle size={16} /> Smart candidate matching</li>
                <li><CheckCircle size={16} /> Application management tools</li>
              </ul>
              <Link to="/school/register" className="btn btn-white btn-lg" style={{ color: '#c77700' }}>
                Register Institution <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NUMBERS BANNER ─── */}
      <section className="numbers-banner">
        <div className="container">
          <div className="numbers-row">
            <div className="number-item">
              <div className="number-val">{count.teachers.toLocaleString()}+</div>
              <div className="number-label">Registered Teachers</div>
            </div>
            <div className="number-item">
              <div className="number-val">{count.schools.toLocaleString()}+</div>
              <div className="number-label">Partner Schools</div>
            </div>
            <div className="number-item">
              <div className="number-val">{count.jobs.toLocaleString()}+</div>
              <div className="number-label">Jobs Posted</div>
            </div>
            <div className="number-item">
              <div className="number-val">98%</div>
              <div className="number-label">Placement Success</div>
            </div>
            <div className="number-item">
              <div className="number-val">200+</div>
              <div className="number-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
