import axios from 'axios';

const API = axios.create({ baseURL: 'https://eduhire-backen.onrender.com/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const jobsAPI = {
  getAll:    (params) => API.get('/jobs', { params }),
  getById:   (id)     => API.get(`/jobs/${id}`),
  create:    (data)   => API.post('/jobs', data),
  update:    (id, data) => API.put(`/jobs/${id}`, data),
  delete:    (id)     => API.delete(`/jobs/${id}`),
  getMyJobs: ()       => API.get('/jobs/school/myjobs'),
};

export const applicationsAPI = {
  apply:             (jobId, coverLetter) => API.post('/applications', { jobId, coverLetter }),
  getMyApplications: ()       => API.get('/applications/teacher'),
  getJobApplications:(jobId)  => API.get(`/applications/job/${jobId}`),
  updateStatus:      (id, data) => API.put(`/applications/${id}/status`, data),
  checkApplied:      (jobId)  => API.get(`/applications/check/${jobId}`),
};

export const teacherAPI = {
  getProfile:    ()     => API.get('/teachers/profile'),
  updateProfile: (data) => API.put('/teachers/profile', data),
  uploadResume:  (fd)   => API.post('/teachers/upload-resume', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getStats: () => API.get('/teachers/stats'),
};

export const schoolAPI = {
  getProfile:    ()     => API.get('/schools/profile'),
  updateProfile: (data) => API.put('/schools/profile', data),
  getStats:      ()     => API.get('/schools/stats'),
};

export const adminAPI = {
  getStats:    ()              => API.get('/admin/stats'),
  getSchools:  ()              => API.get('/admin/schools'),
  verifySchool:(id, isVerified)=> API.put(`/admin/schools/${id}/verify`, { isVerified }),
  getTeachers: ()              => API.get('/admin/teachers'),
  getJobs:     ()              => API.get('/admin/jobs'),
};

export default API;
