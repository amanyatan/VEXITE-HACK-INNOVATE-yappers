require('dotenv').config();

const cors = require('cors');
const express = require('express');
const agentRoutes = require('./routes/agent.routes');
const codingRoutes = require('./routes/coding.routes');
const searchRoutes = require('./routes/search.routes');
const studyRoutes = require('./routes/study.routes');
const voiceRoutes = require('./routes/voice.routes');
const { normalizeError } = require('./utils/errors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/agent', agentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/study', studyRoutes);

app.use((error, _request, response, _next) => {
  const normalized = normalizeError(error, 'The server encountered an internal error.');
  response.status(500).json(normalized);
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
