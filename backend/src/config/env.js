require('dotenv').config();

const env = {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  sarvamApiKey: process.env.SARVAM_API_KEY || '',
  tavilyApiKey: process.env.TAVILY_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};

module.exports = { env };
