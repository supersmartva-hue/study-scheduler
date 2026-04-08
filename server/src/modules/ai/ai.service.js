const { query } = require('../../config/database');
const { openaiClient, isMockMode } = require('../../config/openai');
const { SYSTEM_PROMPT, buildSchedulePrompt } = require('./ai.prompts');
const { generateMockSchedule } = require('./ai.mock');
const { getMondayOfWeek } = require('../../utils/dateUtils');

async function generateSchedule(userId) {
  // Fetch subjects
  const subjectsResult = await query(
    'SELECT * FROM subjects WHERE user_id = $1 AND is_active = TRUE ORDER BY priority DESC, deadline ASC NULLS LAST',
    [userId]
  );
  const subjects = subjectsResult.rows;
  if (subjects.length === 0) {
    const err = new Error('Add at least one subject before generating a schedule');
    err.status = 400;
    throw err;
  }

  // Fetch user preferences
  const userResult = await query(
    'SELECT study_start_hour, study_end_hour, timezone, daily_goal_hours FROM users WHERE id = $1',
    [userId]
  );
  const user = userResult.rows[0];

  // Fetch last 7 days sessions for context
  const recentResult = await query(
    `SELECT subject_id, planned_date, status, duration_mins FROM study_sessions
     WHERE user_id = $1 AND planned_date >= CURRENT_DATE - interval '7 days'`,
    [userId]
  );
  const recentSessions = recentResult.rows;

  const weekStartDate = getMondayOfWeek();
  let scheduleData;

  if (isMockMode) {
    scheduleData = generateMockSchedule(subjects, weekStartDate);
  } else {
    const prompt = buildSchedulePrompt(user, subjects, recentSessions, weekStartDate);
    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 3000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });
    scheduleData = JSON.parse(completion.choices[0].message.content);
  }

  // Deactivate old schedules
  await query('UPDATE schedules SET is_active = FALSE WHERE user_id = $1', [userId]);

  // Insert new schedule
  const schedResult = await query(
    `INSERT INTO schedules (user_id, week_start_date, ai_reasoning, is_active, raw_ai_response)
     VALUES ($1, $2, $3, TRUE, $4) RETURNING *`,
    [userId, scheduleData.week_start_date, scheduleData.reasoning, JSON.stringify(scheduleData)]
  );
  const schedule = schedResult.rows[0];

  // Insert sessions
  const insertedSessions = [];
  for (const s of scheduleData.sessions) {
    const durationMins = calcDuration(s.start_time, s.end_time);
    const sessionResult = await query(
      `INSERT INTO study_sessions
         (user_id, subject_id, schedule_id, title, planned_date, start_time, end_time, duration_mins, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [userId, s.subject_id, schedule.id, s.title, s.planned_date, s.start_time, s.end_time, durationMins, s.notes || null]
    );
    insertedSessions.push(sessionResult.rows[0]);
  }

  return { schedule, sessions: insertedSessions, isMock: isMockMode };
}

async function getActiveSchedule(userId) {
  const schedResult = await query(
    'SELECT * FROM schedules WHERE user_id = $1 AND is_active = TRUE ORDER BY generated_at DESC LIMIT 1',
    [userId]
  );
  if (!schedResult.rows[0]) return null;

  const schedule = schedResult.rows[0];
  const sessionsResult = await query(
    `SELECT ss.*, s.name AS subject_name, s.color AS subject_color
     FROM study_sessions ss JOIN subjects s ON s.id = ss.subject_id
     WHERE ss.schedule_id = $1 ORDER BY ss.planned_date, ss.start_time`,
    [schedule.id]
  );

  return { ...schedule, sessions: sessionsResult.rows };
}

function calcDuration(startTime, endTime) {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

module.exports = { generateSchedule, getActiveSchedule };
