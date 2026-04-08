const { register, login } = require('./auth.service');
const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
  timezone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function handleRegister(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await register(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function handleLogin(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await login(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { handleRegister, handleLogin };
