function normalizeError(error, fallbackMessage = 'Something went wrong.') {
  const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : fallbackMessage;

  return {
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  };
}

module.exports = { normalizeError };
