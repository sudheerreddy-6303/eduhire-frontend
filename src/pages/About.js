import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Target, Heart, Award } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>About EduHire</h1>
          <p>Connecting schools with qualified teachers since 2020</p>
        </div>
      </div>

      <div className="container about-content">
        <div className="about-intro card">
          <div className="about-icon"><GraduationCap size={40} /></div>
          <h2>Our Mission</h2>
          <p>EduHire was built with one goal in mind: to make teacher recruitment simpler, faster, and more trustworthy for everyone involved. We believe great teachers deserve great opportunities — and great schools deserve to find them easily.</p>
        </div>

        <div className="grid-3" style={{marginTop: 40}}>
          {[
            { icon: Target, title: 'Our Vision', desc: 'To become India\'s most trusted platform connecting educators with institutions, empowering the future of education.' },
            { icon: Heart, title: 'Our Values', desc: 'Transparency, trust, and support for educators. We stand for fair hiring practices and equal opportunities for all teachers.' },
            { icon: Award, title: 'Our Impact', desc: 'Over 10,000 successful placements, 2,500+ verified schools, and a 98% satisfaction rate among users.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card about-card">
              <div className="about-card-icon"><Icon size={28} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className="about-cta card">
          <h2>Join EduHire Today</h2>
          <p>Whether you're a teacher looking for your next opportunity or a school searching for talented educators, EduHire makes the connection simple.</p>
          <div style={{display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap'}}>
            <Link to="/teacher/register" className="btn btn-primary btn-lg">Join as Teacher</Link>
            <Link to="/school/register" className="btn btn-outline btn-lg">Register School</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
