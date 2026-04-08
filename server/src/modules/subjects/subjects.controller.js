const { listSubjects, createSubject, getSubject, updateSubject, deleteSubject } = require('./subjects.service');
const { z } = require('zod');

const subjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  estimatedHours: z.number().positive(),
  deadline: z.string().optional().nullable(),
  priority: z.number().int().min(1).max(5).optional(),
});

async function handleList(req, res, next) {
  try { res.json(await listSubjects(req.user.id)); } catch (err) { next(err); }
}
async function handleCreate(req, res, next) {
  try {
    const data = subjectSchema.parse(req.body);
    res.status(201).json(await createSubject(req.user.id, data));
  } catch (err) { next(err); }
}
async function handleGet(req, res, next) {
  try { res.json(await getSubject(req.user.id, req.params.id)); } catch (err) { next(err); }
}
async function handleUpdate(req, res, next) {
  try {
    const data = subjectSchema.partial().parse(req.body);
    res.json(await updateSubject(req.user.id, req.params.id, data));
  } catch (err) { next(err); }
}
async function handleDelete(req, res, next) {
  try {
    await deleteSubject(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { handleList, handleCreate, handleGet, handleUpdate, handleDelete };
