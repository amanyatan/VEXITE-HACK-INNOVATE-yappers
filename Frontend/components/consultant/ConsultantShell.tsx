'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterStage } from '@/components/avatar/CharacterStage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { backendBaseUrl } from '@/lib/constants';
import { useVoiceChat } from '@/hooks/useVoiceChat';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export function ConsultantShell() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Yaar, pressure ho raha hai? Chalo ek-ek karke samajhte hain. Pehle sabse chhota step decide karte hain.' },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const sendMessageRef = useRef<(spokenMessage?: string) => Promise<void>>(async () => undefined);
  const { listening, speaking, startListening, stopListening, stopSpeaking, speak } = useVoiceChat();

  const sendMessage = useCallback(async (spokenMessage?: string) => {
    const value = (spokenMessage ?? draft).trim();
    if (!value) return;

    setMessages((current) => [...current, { role: 'user', text: value }]);
    if (!spokenMessage) setDraft('');
    setLoading(true);

    try {
      const response = await fetch(`${backendBaseUrl}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'consultant', message: value }),
      });

      const payload = await response.json();
      const text = response.ok ? payload.message : payload?.error?.message || 'Let’s slow it down and take the next step together.';
      setMessages((current) => [...current, { role: 'assistant', text }]);
      if (audioEnabled && response.ok) {
        try {
          await speak(text, (transcript) => void sendMessageRef.current(transcript));
        } catch (error) {
          setVoiceError(error instanceof Error ? error.message : 'Voice reply failed.');
        }
      }
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'Let’s break it into 2 small tasks and handle one at a time.' }]);
    } finally {
      setLoading(false);
    }
  }, [audioEnabled, draft, speak]);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="glass rounded-2xl p-6 sm:p-10">
        <div className="mb-8 flex justify-center">
          <CharacterStage listening={listening} speaking={speaking} thinking={loading} caption="A quiet space to think out loud" />
        </div>
        <p className="mx-auto mb-7 max-w-xl text-center text-2xl font-medium leading-9 text-white sm:text-3xl">&ldquo;You don&apos;t have to solve everything today. What feels heaviest right now?&rdquo;</p>
      </div>

      <div className="mt-5 space-y-4 rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/80 p-5">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'assistant' ? 'bg-white/[0.04] text-zinc-300' : 'ml-auto max-w-xl bg-violet-600 text-white'}`}>
            {message.text}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {speaking && (
          <Button variant="primary" onClick={stopSpeaking}>
            ⏹ Stop AI voice
          </Button>
        )}
        <Button variant={audioEnabled ? 'primary' : 'secondary'} onClick={() => { setAudioEnabled((enabled) => !enabled); setVoiceError(''); }}>
          {audioEnabled ? '🔊 Audio on' : '🔇 Chat with audio'}
        </Button>
        <Button variant={listening ? 'primary' : 'secondary'} onClick={() => { setVoiceError(''); try { if (listening) { stopListening(); } else { startListening((transcript) => void sendMessageRef.current(transcript)); } } catch (error) { setVoiceError(error instanceof Error ? error.message : 'Voice input failed.'); } }}>
          {listening ? 'Stop listening' : speaking ? '⏹ Interrupt & speak' : '🎙 Speak'}
        </Button>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Tell me more..."
          className="flex-1"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
        <Button onClick={() => void sendMessage()} disabled={loading || !draft.trim()}>
          {loading ? 'Thinking...' : 'Send'}
        </Button>
      </div>
      {voiceError && <p className="mt-3 text-sm text-rose-300">{voiceError}</p>}
    </div>
  );
}
