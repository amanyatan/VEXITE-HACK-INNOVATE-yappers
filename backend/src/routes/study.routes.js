const express = require('express');
const { normalizeError } = require('../utils/errors');

const router = express.Router();

router.post('/session', async (request, response) => {
  try {
    const { subject, goal, durationMinutes } = request.body || {};

    if (!subject || !goal || !durationMinutes) {
      return response.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'subject, goal, and durationMinutes are required.',
        },
      });
    }

    return response.json({
      sessionId: `study_${Date.now()}`,
      status: 'created',
      subject,
      goal,
      durationMinutes,
      focusState: 'FOCUSED',
    });
  } catch (error) {
    return response.status(500).json(normalizeError(error, 'Could not create the study session.'));
  }
});

module.exports = router;
