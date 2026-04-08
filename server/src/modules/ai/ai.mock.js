const { addDays, format } = require('../../utils/dateUtils');

// Generates a realistic mock schedule without calling OpenAI
function generateMockSchedule(subjects, weekStartDate) {
  const sessions = [];
  const durations = [50, 90, 25, 50, 90];
  const startTimes = ['09:00', '10:30', '14:00', '15:30', '17:00', '19:00'];

  subjects.forEach((subject, si) => {
    const hoursNeeded = Math.max(0, subject.estimated_hours - subject.hours_completed);
    const sessionsNeeded = Math.min(Math.ceil(hoursNeeded / 1.5), 3);

    for (let i = 0; i < sessionsNeeded; i++) {
      const dayOffset = (si * 2 + i) % 7;
      const plannedDate = format(addDays(new Date(weekStartDate), dayOffset));
      const startTime = startTimes[i % startTimes.length];
      const durationMins = durations[i % durations.length];
      const endTime = addMinutes(startTime, durationMins);

      sessions.push({
        subject_id: subject.id,
        planned_date: plannedDate,
        start_time: startTime,
        end_time: endTime,
        title: `${subject.name} — Session ${i + 1}`,
        notes: `Focus on core concepts. Difficulty level: ${subject.difficulty}/5`,
      });
    }
  });

  return {
    week_start_date: weekStartDate,
    reasoning: `Mock schedule generated. Subjects ordered by priority. ${subjects.length} subject(s) scheduled across the week.`,
    sessions,
  };
}

function addMinutes(timeStr, mins) {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

module.exports = { generateMockSchedule };
