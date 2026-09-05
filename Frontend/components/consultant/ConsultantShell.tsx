'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterStage } from '@/components/avatar/CharacterStage';
import { Button } from '@/components/ui/Button';
import { backendBaseUrl } from '@/lib/constants';
import { useVoiceChat } from '@/hooks/useVoiceChat';

type MentorState = 'idle' | 'listening' | 'thinking' | 'speaking';

export function ConsultantShell() {
  const [mentorState, setMentorState] = useState<MentorState>('idle');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const voiceModeRef = useRef(false);
  const sendMessageRef = useRef<(message: string) => Promise<void>>(async () => undefined);
  const { listening, speaking, startListening, stopListening, stopSpeaking, speak } = useVoiceChat();

  const listenAgain = useCallback(() => {
    if (!voiceModeRef.current || speaking) return;
    try {
      startListening(
        (transcript) => void sendMessageRef.current(transcript),
        (message) => {
          voiceModeRef.current = false;
          setVoiceActive(false);
          setMentorState('idle');
          setVoiceError(message);
        },
      );
      setMentorState('listening');
    } catch (error) {
      voiceModeRef.current = false;
      setVoiceActive(false);
      setMentorState('idle');
      setVoiceError(error instanceof Error ? error.message : 'Microphone access is unavailable.');
    }
  }, [speaking, startListening]);

  const sendMessage = useCallback(async (message: string) => {
    const value = message.trim();
    if (!value || !voiceModeRef.current) return;
    stopListening();
    setMentorState('thinking');
    setVoiceError('');

    try {
      const response = await fetch(`${backendBaseUrl}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'consultant', message: value }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'Mentor is unavailable right now.');
      await speak(payload.message || 'Theek hai, ek chhota step se start karte hain.');
      setMentorState('speaking');
      window.setTimeout(() => {
        if (voiceModeRef.current) listenAgain();
      }, 250);
    } catch (error) {
      setVoiceError(error instanceof Error ? error.message : 'I could not respond by voice.');
      setMentorState('idle');
    }
  }, [listenAgain, speak, stopListening]);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    if (!speaking && voiceModeRef.current && mentorState === 'speaking') listenAgain();
  }, [listenAgain, mentorState, speaking]);

  const toggleMentor = () => {
    if (voiceModeRef.current) {
      voiceModeRef.current = false;
      setVoiceActive(false);
      stopListening();
      stopSpeaking();
      setMentorState('idle');
      return;
    }
    voiceModeRef.current = true;
    setVoiceActive(true);
    setVoiceError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      voiceModeRef.current = false;
      setVoiceActive(false);
      setVoiceError('Microphone access is not supported in this browser.');
      return;
    }
    void navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      stream.getTracks().forEach((track) => track.stop());
      listenAgain();
    }).catch(() => {
      voiceModeRef.current = false;
      setVoiceActive(false);
      setVoiceError('Microphone permission is required. Allow access and try again.');
    });
  };

  return (
    <section className="mx-auto max-w-4xl">
      <div className="glass rounded-3xl p-6 text-center sm:p-12">
        <div className="flex justify-center">
          <CharacterStage listening={listening} speaking={speaking} thinking={mentorState === 'thinking'} caption={mentorState === 'listening' ? 'I am listening' : mentorState === 'speaking' ? 'Your mentor is speaking' : mentorState === 'thinking' ? 'Thinking about your next step' : 'A calm space to talk'} />
        </div>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Talk it through with your mentor.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400">One button starts a private voice conversation. Share what is on your mind and get one clear, caring next step.</p>
        <Button onClick={toggleMentor} className="mt-8 min-w-44 rounded-full px-6 py-3">
          {voiceActive ? 'End conversation' : 'Let’s talk'}
        </Button>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-600">
          {mentorState === 'listening' ? 'Listening for you' : mentorState === 'thinking' ? 'Preparing a short answer' : mentorState === 'speaking' ? 'Voice reply in progress' : 'Voice only · no typing needed'}
        </p>
        {speaking && <button type="button" onClick={stopSpeaking} className="focus-ring mt-5 text-xs text-violet-300 hover:text-white">Stop voice</button>}
        {voiceError && <p role="alert" className="mt-5 text-sm text-rose-300">{voiceError}</p>}
      </div>
    </section>
  );
}
