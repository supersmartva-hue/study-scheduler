const { generateSchedule, getActiveSchedule } = require('./ai.service');

async function handleGenerate(req, res, next) {
  try {
    const result = await generateSchedule(req.user.id);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

async function handleGetActive(req, res, next) {
  try {
    const schedule = await getActiveSchedule(req.user.id);
    if (!schedule) return res.status(404).json({ error: 'No active schedule found' });
    res.json(schedule);
  } catch (err) { next(err); }
}

module.exports = { handleGenerate, handleGetActive };
