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

const promptSuggestions = [
  'Help me make a study plan',
  'Explain a difficult topic',
  'Find resources for my roadmap',
];

export function CommunicationShell() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Bhai, ready ho? Ask me what to study, how to start, or what project to build next.' },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [voiceNotice, setVoiceNotice] = useState('');
  const [showActions, setShowActions] = useState(false);
  const sendMessageRef = useRef<(spokenMessage?: string) => Promise<void>>(async () => undefined);
  const { listening, speaking, startListening, stopListening, stopSpeaking, speak } = useVoiceChat();

  const sendMessage = useCallback(async (spokenMessage?: string) => {
    const message = (spokenMessage ?? draft).trim();
    if (!message) return;

    setMessages((current) => [...current, { role: 'user', text: message }]);
    if (!spokenMessage) setDraft('');
    setLoading(true);
    setVoiceError('');

    try {
      const response = await fetch(`${backendBaseUrl}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'communication', message }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'Unable to reach the agent right now.');

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

  const toggleVoice = () => {
    setVoiceError('');
    if (audioEnabled) {
      stopListening();
      stopSpeaking();
      setAudioEnabled(false);
      setVoiceNotice('Voice chat is off. You can turn it back on anytime.');
      return;
    }

    setAudioEnabled(true);
    setVoiceNotice('Your browser will ask for microphone access. Choose Allow to speak with Yappers.');
    try {
      startListening((transcript) => {
        setVoiceNotice('I heard you. Yappers is thinking and will reply with voice.');
        void sendMessageRef.current(transcript);
      });
    } catch (error) {
      setAudioEnabled(false);
      setVoiceNotice('');
      setVoiceError(error instanceof Error ? error.message : 'Voice input failed.');
    }
  };

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#101010]/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full ${speaking ? 'animate-pulse bg-violet-400' : listening ? 'animate-pulse bg-emerald-400' : 'bg-zinc-600'}`} />
          <div>
            <p className="text-sm font-medium text-white">Yappers</p>
            <p className="text-xs text-zinc-500">{speaking ? 'Speaking' : listening ? 'Listening' : loading ? 'Thinking' : 'AI study companion'}</p>
          </div>
        </div>
        <span className="hidden text-xs text-zinc-600 sm:block">Communication mode</span>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="border-b border-white/[0.07] px-5 py-4 sm:px-8">
          <CharacterStage speaking={speaking} listening={listening} thinking={loading} caption={speaking ? 'Yappers is replying out loud' : listening ? 'Speak naturally — I am listening' : 'Ask anything about your learning'} />
        </div>

        <div className="min-h-[260px] space-y-5 px-5 py-6 sm:px-10">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">Y</div>}
              <div className={`max-w-[min(90%,42rem)] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'assistant' ? 'rounded-tl-sm bg-white/[0.05] text-zinc-300' : 'rounded-tr-sm bg-violet-600 text-white'}`}>
                {message.text}
              </div>
            </div>
          ))}
          {loading && <div className="flex items-center gap-3 text-sm text-zinc-500"><div className="flex gap-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:240ms]" /></div> Yappers is thinking</div>}
        </div>

        <div className="border-t border-white/[0.07] bg-[#0a0a0a]/70 p-4 sm:p-5">
          {(voiceNotice || voiceError) && (
            <div role={voiceError ? 'alert' : 'status'} className={`mb-3 flex items-start gap-3 rounded-xl border px-3 py-3 text-sm ${voiceError ? 'border-rose-400/25 bg-rose-500/10 text-rose-200' : 'border-violet-400/25 bg-violet-500/10 text-violet-100'}`}>
              <span aria-hidden="true">{voiceError ? '!' : '◉'}</span>
              <span>{voiceError || voiceNotice}</span>
            </div>
          )}

          {showActions && (
            <div className="mb-3 flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => { setDraft(suggestion); setShowActions(false); }} className="focus-ring rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white">
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#151515] p-2 focus-within:border-violet-400/60">
            <button type="button" aria-label="Add a prompt suggestion" aria-expanded={showActions} onClick={() => setShowActions((visible) => !visible)} className="focus-ring mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl text-zinc-400 transition hover:bg-white/[0.06] hover:text-white">+</button>
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Message Yappers..."
              aria-label="Message Yappers"
              className="min-h-10 flex-1 border-0 bg-transparent px-2 py-2 shadow-none focus:bg-transparent focus:ring-0"
            />
            <button type="button" onClick={toggleVoice} aria-pressed={audioEnabled} aria-label={audioEnabled ? 'Turn voice chat off' : 'Turn voice chat on'} className={`focus-ring mb-0.5 flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-medium transition ${audioEnabled ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'}`}>
              <span aria-hidden="true">{audioEnabled ? '◉' : '◌'}</span><span className="hidden sm:inline">{audioEnabled ? 'Voice on' : 'Voice'}</span>
            </button>
            <Button onClick={() => void sendMessage()} disabled={loading || !draft.trim()} className="mb-0.5 h-10 rounded-xl px-4">
              <span className="hidden sm:inline">{loading ? 'Thinking' : 'Send'}</span><span className="sm:hidden" aria-hidden="true">↑</span>
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-zinc-600">Press Enter to send · Voice replies use your selected voice setting</p>

          {speaking && (
            <button type="button" onClick={stopSpeaking} className="focus-ring mx-auto mt-3 block text-xs text-violet-300 transition hover:text-white">
              Stop Yappers speaking
            </button>
          )}
        </div>
      </div>

      {resources.length > 0 && (
        <details className="mt-4 rounded-2xl border border-white/[0.08] bg-[#101010]/70 p-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-zinc-300">Sources from this conversation <span className="ml-1 text-xs text-zinc-600">({resources.length})</span></summary>
          <div className="mt-4 space-y-3">
            {resources.map((resource) => <ResourceCard key={resource.url} title={resource.title} description={resource.snippet} url={resource.url} source={resource.source} />)}
          </div>
        </details>
      )}
    </section>
  );
}
