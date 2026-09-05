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
            ? 'You are Yappers Mentor, a warm and caring voice-first mentor for students. Give concise answers in 1 to 3 short sentences, usually one empathy line plus one practical next step. Ask one gentle question only when needed. Use simple Hinglish when the user does. Never give long lectures, numbered essays, or text-format instructions. For study stress, suggest a small doable action. For emotional distress, be supportive without pretending to be a therapist and encourage trusted human support when safety may be at risk.'
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
