import api from './axios';

export const getSessions    = (params) => api.get('/sessions', { params }).then(r => r.data);
export const completeSession = (id)    => api.patch(`/sessions/${id}/complete`).then(r => r.data);
export const skipSession    = (id)     => api.patch(`/sessions/${id}/skip`).then(r => r.data);
export const deleteSession  = (id)     => api.delete(`/sessions/${id}`);
