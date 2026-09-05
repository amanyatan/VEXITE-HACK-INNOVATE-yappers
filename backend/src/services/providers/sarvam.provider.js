const fetch = global.fetch;

function getSarvamConfig() {
  const baseUrl = process.env.SARVAM_API_BASE_URL || process.env.SARVAM_API_URL || 'https://api.sarvam.ai';
  const model = process.env.SARVAM_CHAT_MODEL || 'sarvam-105b-conversations';
  const chatEndpoint = process.env.SARVAM_CHAT_ENDPOINT || `${baseUrl.replace(/\/$/, '')}/v1/chat/completions`;

  return {
    apiKey: process.env.SARVAM_API_KEY || '',
    chatEndpoint,
    model,
  };
}

async function chat({ message, mode = 'communication' }) {
  const { apiKey, chatEndpoint, model } = getSarvamConfig();

  if (!apiKey) {
    throw new Error('Sarvam API key is not configured.');
  }

  const response = await fetch(chatEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: mode === 'consultant'
            ? 'You are Yappers, a supportive student companion. Keep responses warm, practical, and encouraging. Avoid clinical claims and encourage human support when needed.'
            : 'You are Yappers, a helpful study companion for planning, learning, and coding guidance.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Sarvam request failed.');
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content || payload.output?.text || payload.message || '';

  if (!content) {
    throw new Error('Sarvam response was empty.');
  }

  return {
    message: String(content).trim(),
    provider: 'sarvam',
  };
}

module.exports = { chat };
