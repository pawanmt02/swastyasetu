import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getPatients = async (category) => {
  const url = category ? `/patients?category=${category}` : '/patients';
  const response = await api.get(url);
  return response.data;
};

export const getPatient = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const createPatient = async (data) => {
  const response = await api.post('/patients', data);
  return response.data;
};

export const predictTriage = async (data) => {
  const response = await api.post('/triage/predict', data);
  return response.data;
};

export const getExplanation = async (id) => {
  const response = await api.get(`/triage/explain/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/triage/stats');
  return response.data;
};

export default api;
