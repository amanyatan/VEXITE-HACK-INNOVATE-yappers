const express = require('express');
const { searchTavily } = require('../services/search/tavily.service');
const { normalizeError } = require('../utils/errors');

const router = express.Router();

router.post('/', async (request, response) => {
  try {
    const { query } = request.body || {};

    if (!query || !String(query).trim()) {
      return response.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'A search query is required.' } });
    }

    const result = await searchTavily(String(query).trim());

    if (result.error) {
      return response.status(503).json({ ...result, results: [] });
    }

    return response.json({ results: result.results });
  } catch (error) {
    return response.status(500).json(normalizeError(error, 'The search provider is temporarily unavailable.'));
  }
});

module.exports = router;
