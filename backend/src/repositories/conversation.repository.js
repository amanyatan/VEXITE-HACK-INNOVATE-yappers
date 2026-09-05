const { supabase } = require('../config/supabase');

async function saveConversation({ userId, mode, title, message }) {
  if (!supabase) {
    return { id: `local_${Date.now()}`, mode, title: title || 'conversation', message };
  }

  const { data, error } = await supabase.from('conversations').insert({
    user_id: userId,
    mode,
    title: title || 'Untitled conversation',
  }).select().single();

  if (error) {
    throw error;
  }

  await supabase.from('messages').insert({
    conversation_id: data.id,
    user_id: userId,
    role: 'user',
    content: message,
  });

  return data;
}

module.exports = { saveConversation };
