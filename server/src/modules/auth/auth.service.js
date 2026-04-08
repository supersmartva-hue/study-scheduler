const { query } = require('../../config/database');
const { hash, compare } = require('../../utils/password');
const { signToken } = require('../../utils/jwt');

async function register({ email, password, fullName, timezone }) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const passwordHash = await hash(password);
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, timezone)
     VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, timezone, created_at`,
    [email.toLowerCase(), passwordHash, fullName || null, timezone || 'UTC']
  );
  const user = result.rows[0];

  // Create gamification profile
  await query('INSERT INTO user_gamification (user_id) VALUES ($1)', [user.id]);

  const token = signToken({ id: user.id, email: user.email });
  return { token, user };
}

async function login({ email, password }) {
  const result = await query(
    'SELECT id, email, full_name, password_hash, timezone FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  const user = result.rows[0];

  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const valid = await compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const { password_hash, ...safeUser } = user;
  const token = signToken({ id: user.id, email: user.email });
  return { token, user: safeUser };
}

module.exports = { register, login };
