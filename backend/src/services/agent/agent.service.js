const { chat: sarvamChat } = require('../providers/sarvam.provider');
const { chat: geminiChat } = require('../providers/gemini.provider');

function buildLocalResponse(message, mode = 'communication') {
  const text = message.toLowerCase();

  if (text.includes('ml') || text.includes('ai') || text.includes('roadmap') || text.includes('start')) {
    return {
      message:
        'Bhai, AI/ML mein switch karna hai toh pehle Python, statistics, and ML basics karna chahiye. Isse baad TensorFlow ka beginner project banate hain. Aaj ka focus: Python basics + 1 mini project.',
      provider: 'local-fallback',
      resources: [
        {
          title: 'Machine Learning Specialization',
          url: 'https://www.coursera.org/specializations/machine-learning-introduction',
          snippet: 'A structured beginner-friendly path into ML fundamentals.',
          source: 'Coursera',
        },
        {
          title: 'TensorFlow for Beginners',
          url: 'https://www.tensorflow.org/tutorials',
          snippet: 'Hands-on tutorials to start building models quickly.',
          source: 'TensorFlow',
        },
      ],
    };
  }

  if (text.includes('tic') || text.includes('game') || text.includes('project')) {
    return {
      message:
        'Perfect. Main ek simple Tic-Tac-Toe MVP bana sakta hoon. Pehle project structure define karte hain, phir minimum valid code aur run check karte hain.',
      provider: 'local-fallback',
      resources: [],
    };
  }

  if (mode === 'consultant') {
    return {
      message:
        'Samajh raha hoon bhai. Aaj sirf ek chhota topic choose karo aur 20 minutes usi par focus karo.',
      provider: 'local-fallback',
      resources: [],
    };
  }

  return {
    message:
      'Yappers ka simple approach: pehle goal define karo, phir 30-minute focus block banao, aur phir ek mini project ke through practice karo. Agar chaho, main aaj ke liye ek roadmap bana sakta hoon.',
    provider: 'local-fallback',
    resources: [
      {
        title: 'ML fundamentals roadmap',
        url: 'https://www.youtube.com/results?search_query=machine+learning+roadmap+for+beginners',
        snippet: 'A beginner-friendly roadmap for learning ML in a structured order.',
        source: 'YouTube',
      },
    ],
  };
}

async function handleChat(payload = {}) {
  const { mode = 'communication', message = '', conversationId } = payload;

  if (!message || !String(message).trim()) {
    throw new Error('A message is required for chat.');
  }

  try {
    if (process.env.SARVAM_API_KEY) {
      try {
        const result = await sarvamChat({ message: String(message).trim(), mode });
        return {
          conversationId: conversationId || `conv_${Date.now()}`,
          message: mode === 'consultant'
            ? result.message.replace(/\s+/g, ' ').trim()
            : result.message,
          provider: result.provider,
          resources: [],
        };
      } catch (error) {
        console.warn('Sarvam failed; trying Gemini fallback.', error.message);
      }
    }

    if (process.env.GEMINI_API_KEY) {
      const result = await geminiChat({ message: String(message).trim(), mode });
      return {
        conversationId: conversationId || `conv_${Date.now()}`,
        message: mode === 'consultant'
          ? result.message.replace(/\s+/g, ' ').trim()
          : result.message,
        provider: result.provider,
        resources: [],
      };
    }
  } catch (error) {
    console.warn('Configured AI providers failed, falling back to local response.', error.message);
  }

  const local = buildLocalResponse(String(message).trim(), mode);
  return {
    conversationId: conversationId || `conv_${Date.now()}`,
    ...local,
  };
}

module.exports = { handleChat };
