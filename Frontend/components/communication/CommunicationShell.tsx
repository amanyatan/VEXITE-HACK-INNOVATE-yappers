'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterStage } from '@/components/avatar/CharacterStage';
import { ResourceCard } from '@/components/communication/ResourceCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { backendBaseUrl } from '@/lib/constants';
import { useVoiceChat } from '@/hooks/useVoiceChat';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

type Resource = {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
};

export function CommunicationShell() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Bhai, ready ho? Ask me what to study, how to start, or what project to build next.' },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const sendMessageRef = useRef<(spokenMessage?: string) => Promise<void>>(async () => undefined);
  const { listening, speaking, startListening, stopListening, stopSpeaking, speak } = useVoiceChat();

  const sendMessage = useCallback(async (spokenMessage?: string) => {
    const message = (spokenMessage ?? draft).trim();
    if (!message) return;

    setMessages((current) => [...current, { role: 'user', text: message }]);
    if (!spokenMessage) setDraft('');
    setLoading(true);

    try {
      const response = await fetch(`${backendBaseUrl}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'communication', message }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Unable to reach the agent right now.');
      }

      const assistantText = payload.message || 'I can help with that.';
      setMessages((current) => [...current, { role: 'assistant', text: assistantText }]);
      setResources(Array.isArray(payload.resources) ? payload.resources : []);
      if (audioEnabled) {
        try {
          await speak(assistantText, (transcript) => void sendMessageRef.current(transcript));
        } catch (error) {
          setVoiceError(error instanceof Error ? error.message : 'Voice reply failed.');
        }
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : 'The agent is temporarily unavailable.';
      setMessages((current) => [...current, { role: 'assistant', text }]);
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [audioEnabled, draft, speak]);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex justify-center rounded-2xl bg-gradient-to-b from-violet-950/20 to-transparent">
          <CharacterStage speaking={speaking} listening={listening} thinking={loading} />
        </div>

        <div className="space-y-3">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'assistant' ? 'bg-white/[0.04] text-zinc-300' : 'ml-auto bg-violet-600 text-white'}`}>
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
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Ask Yappers..."
            className="flex-1"
          />
          <Button onClick={() => void sendMessage()} disabled={loading || !draft.trim()}>
            {loading ? 'Thinking...' : 'Send'}
          </Button>
        </div>
        {voiceError && <p className="mt-3 text-sm text-rose-300">{voiceError}</p>}
      </div>

      <div className="space-y-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Resources</p>
          <div className="mt-4 space-y-3">
            {resources.length === 0 ? (
              <p className="text-sm text-zinc-500">Ask for a roadmap or current learning resource to get useful links here.</p>
            ) : (
              resources.map((resource) => (
                <ResourceCard key={resource.url} title={resource.title} description={resource.snippet} url={resource.url} source={resource.source} />
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Build status</p>
          <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] p-3 text-sm text-emerald-200">
            Ready for a simple MVP request like “Build a Tic-Tac-Toe game”.
          </div>
        </div>
      </div>
    </div>
  );
}
