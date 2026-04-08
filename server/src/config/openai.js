const { OPENAI_API_KEY } = require('./env');

let openaiClient = null;

if (OPENAI_API_KEY) {
  try {
    const OpenAI = require('openai');
    openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  } catch {
    console.warn('openai package not installed — using mock AI responses');
  }
}

module.exports = { openaiClient, isMockMode: !openaiClient };
