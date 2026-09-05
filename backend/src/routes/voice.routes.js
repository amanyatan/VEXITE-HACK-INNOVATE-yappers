const express = require('express');
const { synthesizeSpeech } = require('../services/voice/sarvam.service');
const { normalizeError } = require('../utils/errors');

const router = express.Router();

router.post('/tts', async (request, response) => {
  try {
    const { text } = request.body || {};

    if (!text || !String(text).trim()) {
      return response.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Text is required to generate speech.' } });
    }

    if (!process.env.SARVAM_API_KEY) {
      return response.status(503).json({
        error: {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'TTS is unavailable because the Sarvam API key is not configured.',
        },
      });
    }

    const result = await synthesizeSpeech(String(text).trim());
    return response.json({
      status: 'success',
      text: String(text).trim(),
      provider: result.provider,
      audioUrl: result.audioUrl,
      audioBase64: result.audioBase64,
      mimeType: result.audioBase64 ? 'audio/wav' : null,
    });
  } catch (error) {
    return response.status(500).json(normalizeError(error, 'Text-to-speech generation failed.'));
  }
});

module.exports = router;
