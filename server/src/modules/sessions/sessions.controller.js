const svc = require('./sessions.service');
const { z } = require('zod');

const createSchema = z.object({
  subjectId: z.string().uuid(),
  scheduleId: z.string().uuid().optional(),
  title: z.string().optional(),
  plannedDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
});

async function handleList(req, res, next) {
  try { res.json(await svc.listSessions(req.user.id, req.query)); } catch (err) { next(err); }
}
async function handleCreate(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    res.status(201).json(await svc.createSession(req.user.id, data));
  } catch (err) { next(err); }
}
async function handleGet(req, res, next) {
  try { res.json(await svc.getSession(req.user.id, req.params.id)); } catch (err) { next(err); }
}
async function handleUpdate(req, res, next) {
  try { res.json(await svc.updateSession(req.user.id, req.params.id, req.body)); } catch (err) { next(err); }
}
async function handleComplete(req, res, next) {
  try { res.json(await svc.completeSession(req.user.id, req.params.id)); } catch (err) { next(err); }
}
async function handleSkip(req, res, next) {
  try { res.json(await svc.skipSession(req.user.id, req.params.id)); } catch (err) { next(err); }
}
async function handleDelete(req, res, next) {
  try { await svc.deleteSession(req.user.id, req.params.id); res.status(204).send(); } catch (err) { next(err); }
}

module.exports = { handleList, handleCreate, handleGet, handleUpdate, handleComplete, handleSkip, handleDelete };
