import api from './axios';

export const getSubjects  = ()         => api.get('/subjects').then(r => r.data);
export const createSubject = (data)    => api.post('/subjects', data).then(r => r.data);
export const updateSubject = (id, data) => api.patch(`/subjects/${id}`, data).then(r => r.data);
export const deleteSubject = (id)      => api.delete(`/subjects/${id}`);
