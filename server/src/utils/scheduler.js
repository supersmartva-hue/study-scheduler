const cron = require('node-cron');
const { query } = require('../config/database');

function startCronJobs() {
  // Every day at 1am — mark pending sessions from yesterday as missed
  cron.schedule('0 1 * * *', async () => {
    console.log('[CRON] Marking missed sessions...');
    try {
      const result = await query(
        `UPDATE study_sessions
         SET status = 'missed', updated_at = NOW()
         WHERE status = 'pending' AND planned_date < CURRENT_DATE
         RETURNING id, user_id, subject_id, title`,
      );
      const missed = result.rows;
      if (missed.length > 0) {
        console.log(`[CRON] Marked ${missed.length} sessions as missed`);

        // Create missed notifications
        for (const s of missed) {
          await query(
            `INSERT INTO notifications (user_id, session_id, type, title, message)
             VALUES ($1, $2, 'missed', 'Missed session', $3)`,
            [s.user_id, s.id, `You missed "${s.title || 'a study session'}". Consider rescheduling.`]
          );
        }
      }
    } catch (err) {
      console.error('[CRON] Error marking missed sessions:', err.message);
    }
  });

  console.log('[CRON] Jobs scheduled');
}

module.exports = { startCronJobs };
