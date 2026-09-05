'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { backendBaseUrl } from '@/lib/constants';

type SpeechRecognitionEventLike = Event & {
  resultIndex?: number;
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition() {
  if (typeof window === 'undefined') {
    return null;
  }

  const browserWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
  return Recognition ? new Recognition() : null;
}

export function useVoiceChat() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interruptionActiveRef = useRef(false);
  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    interruptionActiveRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    setSpeaking(false);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const startListening = useCallback((onTranscript: (text: string) => void) => {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      throw new Error('Voice input is not supported in this browser. Try Chrome or Edge.');
    }

    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const resultIndex = event.resultIndex ?? 0;
      const transcript = event.results[resultIndex]?.[0]?.transcript?.trim();
      if (transcript) {
        onTranscript(transcript);
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognition.onerror = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const speak = useCallback(async (text: string, onInterrupt?: (text: string) => void) => {
    const response = await fetch(`${backendBaseUrl}/api/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Voice reply is unavailable.');
    }

    const source = payload.audioUrl || (payload.audioBase64 ? `data:${payload.mimeType || 'audio/wav'};base64,${payload.audioBase64}` : '');
    if (!source) {
      throw new Error('The voice provider returned no audio.');
    }

    stopSpeaking();
    const audio = new Audio(source);
    audioRef.current = audio;
    setSpeaking(true);
    interruptionActiveRef.current = Boolean(onInterrupt);

    if (onInterrupt) {
      const recognition = getSpeechRecognition();
      if (recognition) {
        recognition.lang = 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = (event) => {
          const resultIndex = event.resultIndex ?? 0;
          const transcript = event.results[resultIndex]?.[0]?.transcript?.trim();
          if (!transcript || !interruptionActiveRef.current) return;
          stopSpeaking();
          onInterrupt(transcript);
        };
        recognition.onend = () => {
          if (interruptionActiveRef.current && audioRef.current) {
            window.setTimeout(() => {
              if (!interruptionActiveRef.current || !audioRef.current) return;
              try {
                recognition.start();
                recognitionRef.current = recognition;
                setListening(true);
              } catch {
                interruptionActiveRef.current = false;
                setListening(false);
              }
            }, 100);
          }
        };
        recognition.onerror = () => {
          if (interruptionActiveRef.current && audioRef.current) {
            window.setTimeout(() => {
              if (!interruptionActiveRef.current || !audioRef.current) return;
              try {
                recognition.start();
                recognitionRef.current = recognition;
                setListening(true);
              } catch {
                interruptionActiveRef.current = false;
                setListening(false);
              }
            }, 250);
          }
        };
        recognitionRef.current = recognition;
        recognition.start();
        setListening(true);
      }
    }

    audio.onended = () => {
      interruptionActiveRef.current = false;
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      setSpeaking(false);
    };
    audio.onerror = () => setSpeaking(false);
    await audio.play();
  }, [stopSpeaking]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    stopSpeaking();
  }, [stopSpeaking]);

  return { listening, speaking, startListening, stopListening, stopSpeaking, speak };
}
