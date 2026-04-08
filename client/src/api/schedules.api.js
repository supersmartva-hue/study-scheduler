import api from './axios';

export const generateSchedule  = () => api.post('/ai/generate-schedule').then(r => r.data);
export const getActiveSchedule = () => api.get('/ai/active-schedule').then(r => r.data);
