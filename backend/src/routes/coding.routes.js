const express = require('express');
const { buildProject } = require('../services/coding/coding.service');
const { normalizeError } = require('../utils/errors');

const router = express.Router();

router.post('/build', async (request, response) => {
  try {
    const { request: projectRequest } = request.body || {};
    const result = await buildProject(projectRequest || '');
    response.json(result);
  } catch (error) {
    response.status(500).json(normalizeError(error, 'The coding project could not be generated.'));
  }
});

module.exports = router;
