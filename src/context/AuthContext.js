import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: verify token is still valid via /me
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get('https://eduhire-backen.onrender.com/api/auth/me')
      .then(({ data }) => {
        // Merge with stored user (which has token) so it's complete
        const stored = localStorage.getItem('user');
        const merged = stored ? { ...JSON.parse(stored), ...data } : data;
        setUser(merged);
        localStorage.setItem('user', JSON.stringify(merged));
        setLoading(false);
      })
      .catch(() => {
        // Token invalid/expired — clear everything, force re-login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('https://eduhire-backen.onrender.com/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const registerTeacher = async (formData) => {
    const { data } = await axios.post('https://eduhire-backen.onrender.com/api/auth/register/teacher', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const registerSchool = async (formData) => {
    const { data } = await axios.post('https://eduhire-backen.onrender.com/api/auth/register/school', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerTeacher, registerSchool }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
