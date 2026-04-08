const SYSTEM_PROMPT = `You are an expert academic study planner. Create optimal, realistic study schedules based on the student's subjects, deadlines, difficulty levels, and availability. Always return valid JSON. Prioritize subjects with closer deadlines and higher difficulty. Use spaced repetition principles. Never schedule more than 3 consecutive hours on one subject. Respect the student's preferred study window.`;

function buildSchedulePrompt(user, subjects, recentSessions, weekStartDate) {
  return `Create a weekly study schedule for the following student profile:

STUDENT PREFERENCES:
- Study window: ${user.study_start_hour}:00 to ${user.study_end_hour}:00
- Timezone: ${user.timezone}
- Week starting: ${weekStartDate} (Monday)
- Max daily study hours: ${user.daily_goal_hours || 4}

SUBJECTS TO SCHEDULE:
${JSON.stringify(subjects.map(s => ({
  id: s.id,
  name: s.name,
  difficulty: s.difficulty,
  estimated_hours_remaining: Math.max(0, s.estimated_hours - s.hours_completed),
  deadline: s.deadline,
  priority: s.priority,
})), null, 2)}

RECENT ACTIVITY (last 7 days):
${JSON.stringify(recentSessions.map(s => ({
  subject_id: s.subject_id,
  planned_date: s.planned_date,
  status: s.status,
  duration_mins: s.duration_mins,
})), null, 2)}

CONSTRAINTS:
- Sessions must be 25, 50, or 90 minutes (Pomodoro-friendly)
- Leave at least 10-minute gaps between sessions
- Prioritize subjects with deadlines within 7 days
- If a subject was missed recently, reschedule it early in the week
- Do not schedule sessions outside the student's study window

Return ONLY a JSON object with this exact structure:
{
  "week_start_date": "${weekStartDate}",
  "reasoning": "Brief explanation of prioritization logic",
  "sessions": [
    {
      "subject_id": "uuid",
      "planned_date": "YYYY-MM-DD",
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "title": "Short session title",
      "notes": "Optional focus tip"
    }
  ]
}`;
}

function buildReschedulePrompt(missedSessions, existingSessions, user, remainingDays) {
  return `Reschedule the following missed study sessions into the remaining days of the week.

MISSED SESSIONS:
${JSON.stringify(missedSessions, null, 2)}

EXISTING CONFIRMED SESSIONS (avoid conflicts):
${JSON.stringify(existingSessions, null, 2)}

AVAILABLE DAYS: ${remainingDays.join(', ')}
STUDY WINDOW: ${user.study_start_hour}:00 - ${user.study_end_hour}:00

Return ONLY a JSON object:
{
  "sessions": [
    {
      "original_session_id": "uuid",
      "subject_id": "uuid",
      "planned_date": "YYYY-MM-DD",
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "title": "Short title"
    }
  ]
}`;
}

module.exports = { SYSTEM_PROMPT, buildSchedulePrompt, buildReschedulePrompt };
