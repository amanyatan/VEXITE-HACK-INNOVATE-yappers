const fetch = global.fetch;

async function searchTavily(query) {
  if (!process.env.TAVILY_API_KEY) {
    return {
      results: [],
      error: {
        code: 'PROVIDER_UNAVAILABLE',
        message: 'Live search is temporarily unavailable because the Tavily API key is not configured.',
      },
    };
  }

  const endpoint = process.env.TAVILY_SEARCH_ENDPOINT || 'https://api.tavily.com/search';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({ query, max_results: 5, include_answer: true }),
  });

  if (!response.ok) {
    throw new Error('Tavily search failed.');
  }

  const payload = await response.json();
  return {
    results: (payload.results || []).map((result) => ({
      title: result.title || 'Search result',
      url: result.url,
      snippet: result.content || result.snippet,
      source: result.source || 'Tavily',
    })),
  };
}

module.exports = { searchTavily };
