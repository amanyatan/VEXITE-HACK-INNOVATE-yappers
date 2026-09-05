const fetch = global.fetch;

function getTtsConfig() {
  const apiKey = process.env.SARVAM_API_KEY || '';
  const baseUrl = process.env.SARVAM_API_BASE_URL || process.env.SARVAM_API_URL || 'https://api.sarvam.ai';
  const endpoint = process.env.SARVAM_TTS_ENDPOINT || `${baseUrl.replace(/\/$/, '')}/text-to-speech`;
  const model = process.env.SARVAM_TTS_MODEL || 'bulbul:v3';
  const languageCode = process.env.SARVAM_TTS_LANGUAGE_CODE || 'hi-IN';
  const speaker = process.env.SARVAM_VOICE || 'priya';

  return { apiKey, endpoint, model, languageCode, speaker };
}

async function synthesizeSpeech(text) {
  const { apiKey, endpoint, model, languageCode, speaker } = getTtsConfig();

  if (!apiKey) {
    throw new Error('Sarvam TTS API key is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model,
      language_code: languageCode,
      speaker,
      speech_sample_rate: 22050,
      output_audio_codec: 'wav',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Sarvam TTS failed.');
  }

  const payload = await response.json();

  return {
    provider: 'sarvam',
    audioUrl: payload.audioUrl || payload.audio_url || null,
    audioBase64: payload.audios?.[0] || payload.audioBase64 || payload.audio_base64 || null,
  };
}

module.exports = { synthesizeSpeech };
