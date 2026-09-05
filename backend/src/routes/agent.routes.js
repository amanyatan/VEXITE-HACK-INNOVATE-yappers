const express = require('express');
const { handleChat } = require('../services/agent/agent.service');
const { normalizeError } = require('../utils/errors');

const router = express.Router();

router.post('/chat', async (request, response) => {
  try {
    const result = await handleChat(request.body || {});
    response.json(result);
  } catch (error) {
    response.status(500).json(normalizeError(error, 'The agent could not process the request.'));
  }
});

module.exports = router;
