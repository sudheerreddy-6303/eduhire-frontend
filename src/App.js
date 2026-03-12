import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import TeacherRegister from './pages/TeacherRegister';
import SchoolRegister from './pages/SchoolRegister';
import TeacherDashboard from './pages/TeacherDashboard';
import SchoolDashboard from './pages/SchoolDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PostJob from './pages/PostJob';
import About from './pages/About';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/teacher/register" element={<TeacherRegister />} />
              <Route path="/school/register" element={<SchoolRegister />} />
              <Route path="/teacher/dashboard" element={
                <PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>
              } />
              <Route path="/school/dashboard" element={
                <PrivateRoute role="school"><SchoolDashboard /></PrivateRoute>
              } />
              <Route path="/school/post-job" element={
                <PrivateRoute role="school"><PostJob /></PrivateRoute>
              } />
              <Route path="/admin/dashboard" element={
                <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
