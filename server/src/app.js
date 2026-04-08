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

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile/curl) or any localhost port
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    if (origin === CLIENT_URL) return cb(null, true);
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
