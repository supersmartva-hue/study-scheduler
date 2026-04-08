const { getProfile, updateProfile, getStats, getAchievements } = require('./users.service');

async function handleGetMe(req, res, next) {
  try {
    const profile = await getProfile(req.user.id);
    res.json(profile);
  } catch (err) { next(err); }
}

async function handleUpdateMe(req, res, next) {
  try {
    const profile = await updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (err) { next(err); }
}

async function handleGetStats(req, res, next) {
  try {
    const stats = await getStats(req.user.id);
    res.json(stats);
  } catch (err) { next(err); }
}

async function handleGetAchievements(req, res, next) {
  try {
    const achievements = await getAchievements(req.user.id);
    res.json(achievements);
  } catch (err) { next(err); }
}

module.exports = { handleGetMe, handleUpdateMe, handleGetStats, handleGetAchievements };
