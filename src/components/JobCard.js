import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import './JobCard.css';

export default function JobCard({ job }) {
  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));
  const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

  const salaryText = job.salaryMin && job.salaryMax
    ? `₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}/month`
    : job.salaryMin ? `₹${job.salaryMin.toLocaleString()}+/month` : 'Salary not specified';

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="school-logo">
          {job.school?.institutionName?.charAt(0) || 'S'}
        </div>
        <div className="job-meta">
          <h3 className="job-title">{job.title}</h3>
          <div className="school-name">
            {job.school?.institutionName}
            {job.school?.isVerified && <CheckCircle size={14} className="verified-icon" />}
          </div>
        </div>
        <span className={`badge ${job.jobType === 'Full-time' ? 'badge-green' : 'badge-amber'}`}>
          {job.jobType}
        </span>
      </div>

      <div className="job-card-details">
        <span><MapPin size={14} /> {job.location}</span>
        <span><DollarSign size={14} /> {salaryText}</span>
        <span><Clock size={14} /> {timeLabel}</span>
      </div>

      <div className="job-card-footer">
        <span className="subject-tag">{job.subject}</span>
        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">View Details</Link>
      </div>
    </div>
  );
}
