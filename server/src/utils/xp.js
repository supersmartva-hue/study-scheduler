// XP awarded per completed session based on duration
const XP_PER_MINUTE = 1;
const DIFFICULTY_MULTIPLIER = { 1: 1.0, 2: 1.2, 3: 1.5, 4: 1.8, 5: 2.0 };

function calculateXP(durationMins, difficulty = 3) {
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty] || 1.5;
  return Math.round(durationMins * XP_PER_MINUTE * multiplier);
}

function calculateLevel(xpTotal) {
  return Math.floor(Math.sqrt(xpTotal / 100)) + 1;
}

function xpForNextLevel(level) {
  return Math.pow(level, 2) * 100;
}

module.exports = { calculateXP, calculateLevel, xpForNextLevel };
