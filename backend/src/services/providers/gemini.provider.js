const fetch = global.fetch;

function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const baseUrl = process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const endpoint = process.env.GEMINI_CHAT_ENDPOINT || `${baseUrl.replace(/\/$/, '')}/models/${model}:generateContent?key=${apiKey}`;

  return { apiKey, endpoint, model };
}

async function chat({ message, mode = 'communication' }) {
  const { apiKey, endpoint, model } = getGeminiConfig();

  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: `${mode === 'consultant' ? 'You are Yappers, a warm and practical student-support companion.' : 'You are Yappers, a helpful learning assistant.'}\n\n${message}` }],
      }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Gemini request failed.');
  }

  const payload = await response.json();
  const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Gemini response was empty.');
  }

  return {
    message: String(content).trim(),
    provider: 'gemini',
  };
}

module.exports = { chat, getGeminiConfig };
