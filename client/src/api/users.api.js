import api from './axios';

export const getMe           = ()     => api.get('/users/me').then(r => r.data);
export const updateMe        = (data) => api.patch('/users/me', data).then(r => r.data);
export const getStats        = ()     => api.get('/users/me/stats').then(r => r.data);
export const getAchievements = ()     => api.get('/users/me/achievements').then(r => r.data);
export const getNotifications = ()    => api.get('/notifications').then(r => r.data);
export const getUnreadCount  = ()     => api.get('/notifications/unread-count').then(r => r.data);
export const markRead        = (id)   => api.patch(`/notifications/${id}/read`);
export const markAllRead     = ()     => api.patch('/notifications/read-all');
