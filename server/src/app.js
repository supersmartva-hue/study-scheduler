const express = require('express');
const cors = require('cors');
const { CLIENT_URL } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const subjectsRoutes = require('./modules/subjects/subjects.routes');
const sessionsRoutes = require('./modules/sessions/sessions.routes');
const aiRoutes = require('./modules/ai/ai.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');

const app = express();

const ALLOWED_ORIGINS = [
  CLIENT_URL,
  'https://study-scheduler-rho.vercel.app',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use(errorHandler);

module.exports = app;
