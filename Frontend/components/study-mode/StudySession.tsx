'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterStage } from '@/components/avatar/CharacterStage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { backendBaseUrl } from '@/lib/constants';
import { useVoiceChat } from '@/hooks/useVoiceChat';

type FocusState = 'FOCUSED' | 'NOT_FOCUSED' | 'UNKNOWN' | 'DISTRACTED' | 'PHONE_LIKELY' | 'ABSENT';
type ModelConnection = 'DISCONNECTED' | 'CHECKING' | 'CONNECTED' | 'ERROR';

const focusLabels: Record<FocusState, string> = {
  FOCUSED: 'Focused',
  NOT_FOCUSED: 'Not focused',
  UNKNOWN: 'Model not connected',
  DISTRACTED: 'Take a breath and return to your goal',
  PHONE_LIKELY: 'Phone detected',
  ABSENT: 'Come back when you are ready',
};

const visionModelUrl = process.env.NEXT_PUBLIC_STUDY_VISION_URL;

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function StudySession() {
  const [subject, setSubject] = useState('');
  const [goal, setGoal] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [setupOpen, setSetupOpen] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [focusState, setFocusState] = useState<FocusState>('UNKNOWN');
  const [modelConnection, setModelConnection] = useState<ModelConnection>('DISCONNECTED');
  const [status, setStatus] = useState('');
  const [breakNotice, setBreakNotice] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastNudgeRef = useRef<FocusState | null>(null);
  const completionHandledRef = useRef(false);
  const breakMilestonesRef = useRef<number[]>([]);
  const { listening, speaking, startListening, stopListening, stopSpeaking, speak } = useVoiceChat();

  const say = useCallback(async (text: string) => {
    try {
      await speak(text);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Voice feedback is unavailable.');
    }
  }, [speak]);

  const releaseMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const stopSession = useCallback(() => {
    stopListening();
    stopSpeaking();
    releaseMedia();
    setSessionActive(false);
    setTimeLeft(0);
    setFocusState('UNKNOWN');
    setBreakNotice('');
    setStatus('');
  }, [releaseMedia, stopListening, stopSpeaking]);

  useEffect(() => () => releaseMedia(), [releaseMedia]);

  useEffect(() => {
    if (!sessionActive) return;
    const timer = window.setInterval(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [sessionActive]);

  useEffect(() => {
    if (!sessionActive) return;
    if (timeLeft > 0 || completionHandledRef.current) return;
    completionHandledRef.current = true;
    const completionTimer = window.setTimeout(() => {
      void say('Bhai, study session complete. Great work. Camera monitoring is now stopped.');
      stopSession();
    }, 0);
    return () => window.clearTimeout(completionTimer);
  }, [say, sessionActive, stopSession, timeLeft]);

  useEffect(() => {
    if (!sessionActive || timeLeft <= 0) return;
    const milestone = breakMilestonesRef.current.find((value) => value === timeLeft);
    if (milestone === undefined) return;
    const breakMinutes = 5;
    setBreakNotice(`Take a ${breakMinutes}-minute break, then come back stronger.`);
    void say(`Bhai, one hour complete. Take a ${breakMinutes}-minute break, then continue.`);
  }, [say, sessionActive, timeLeft]);

  const monitorFrame = useCallback(async () => {
    if (!visionModelUrl) {
      setModelConnection('DISCONNECTED');
      setFocusState('UNKNOWN');
      setStatus('Vision model is not connected. Add NEXT_PUBLIC_STUDY_VISION_URL to enable focus detection.');
      return;
    }
    setModelConnection('CHECKING');
    if (!videoRef.current || videoRef.current.readyState < 2) {
      setFocusState('UNKNOWN');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const response = await fetch(visionModelUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: canvas.toDataURL('image/jpeg', 0.65),
        sessionId: subject,
        context: {
          task: 'study_focus_monitoring',
          subject,
          expectedBehavior: 'The student may remain still while reading or thinking. Stillness alone is focused, not distracted.',
          focusedWhen: [
            'A person is visible and seated in front of the camera.',
            'The person is still because they are reading, writing, or thinking.',
            'No external distraction object is visible.',
          ],
          notFocusedWhen: [
            'A phone or unrelated external object is visible and being used.',
            'The person is absent from the camera.',
            'The person is clearly looking away from the study task for a sustained period.',
          ],
          decisionRule: 'Return FOCUSED for a still seated student when no distraction object is detected. Do not infer distraction from stillness.',
          allowedStates: ['FOCUSED', 'NOT_FOCUSED', 'PHONE_LIKELY', 'DISTRACTED', 'ABSENT'],
          responseFormat: { state: 'FOCUSED', objectDetected: false, phoneDetected: false, confidence: 0.95 },
        },
      }),
    });
    if (!response.ok) throw new Error('The study vision model could not analyze this frame.');
    const payload = await response.json() as {
      state?: string;
      focused?: boolean;
      objectDetected?: boolean;
      phoneDetected?: boolean;
      distractionDetected?: boolean;
      label?: string;
    };
    const normalizedState = String(payload.state || payload.label || '').toUpperCase();
    const state = payload.phoneDetected || payload.objectDetected || payload.distractionDetected
      ? 'PHONE_LIKELY'
      : payload.focused === true || normalizedState === 'FOCUSED'
        ? 'FOCUSED'
        : normalizedState === 'DISTRACTED' || normalizedState === 'ABSENT' || normalizedState === 'NOT_FOCUSED'
          ? normalizedState
          : 'NOT_FOCUSED';
    setFocusState(state);
    setModelConnection('CONNECTED');
    setStatus(state === 'FOCUSED' ? 'ML model confirms you are focused.' : 'ML model detected that you are not focused.');
  }, [subject]);

  useEffect(() => {
    if (!sessionActive) return;
    const monitor = window.setInterval(() => {
      void monitorFrame().catch((error: unknown) => {
        setModelConnection('ERROR');
        setFocusState('UNKNOWN');
        setStatus(error instanceof Error ? `ML model connection failed: ${error.message}` : 'ML model connection failed.');
      });
    }, 3000);
    const firstMonitor = window.setTimeout(() => {
      void monitorFrame().catch((error: unknown) => {
        setModelConnection('ERROR');
        setFocusState('UNKNOWN');
        setStatus(error instanceof Error ? `ML model connection failed: ${error.message}` : 'ML model connection failed.');
      });
    }, 0);
    return () => {
      window.clearInterval(monitor);
      window.clearTimeout(firstMonitor);
    };
  }, [monitorFrame, sessionActive]);

  useEffect(() => {
    if (!sessionActive || focusState === 'FOCUSED' || focusState === 'UNKNOWN' || lastNudgeRef.current === focusState) return;
    lastNudgeRef.current = focusState;
    void say('Bhai padh le, kal paper hai.');
  }, [focusState, say, sessionActive]);

  const startSession = async () => {
    const cleanSubject = subject.trim();
    const cleanGoal = goal.trim();
    if (!cleanSubject || !cleanGoal || durationMinutes < 15) {
      setStatus('Add a subject, a goal, and at least 15 minutes.');
      return;
    }

    setStatus('Requesting camera and microphone access...');
    setPermissionDenied(false);
    try {
      const response = await fetch(`${backendBaseUrl}/api/study/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: cleanSubject, goal: cleanGoal, durationMinutes }),
      });
      if (!response.ok) throw new Error('Could not create this study session.');

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeLeft(durationMinutes * 60);
      breakMilestonesRef.current = Array.from({ length: Math.floor(durationMinutes / 60) }, (_, index) => (durationMinutes - (index + 1) * 60) * 60).filter((value) => value > 0);
      setSetupOpen(false);
      setHasSession(true);
      completionHandledRef.current = false;
      setSessionActive(true);
      setFocusState('UNKNOWN');
      setStatus(visionModelUrl ? 'Camera monitoring is active. Waiting for the ML model to verify focus.' : 'Camera is ready, but no ML model is connected. Focus detection is paused.');
      setModelConnection(visionModelUrl ? 'CHECKING' : 'DISCONNECTED');
      void say(`Study mode started for ${cleanSubject}. I will keep you focused.`);
      startListening((transcript) => {
        if (/^(haan|han|yes|okay|ok|theek)/i.test(transcript)) void say('Theek hai bhai, keep going.');
      });
    } catch (error) {
      releaseMedia();
      setPermissionDenied(true);
      setStatus(error instanceof Error ? error.message : 'Camera or microphone access was denied.');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-12rem)]">
      {setupOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="study-setup-title" className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111111] p-6 shadow-2xl shadow-violet-950/30 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-violet-300">New focus session</p>
            <h2 id="study-setup-title" className="mt-2 text-3xl font-semibold text-white">What are we studying?</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Set your goal and we will create a distraction-free session with voice-only encouragement.</p>
            <div className="mt-6 space-y-4">
              <label className="block text-sm text-zinc-300">What do you have to study?
                <Input autoFocus value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. Machine Learning" className="mt-2" />
              </label>
              <label className="block text-sm text-zinc-300">What is the goal?
                <Input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="e.g. Finish neural network basics" className="mt-2" />
              </label>
              <label className="block text-sm text-zinc-300">Duration (minutes)
                <Input type="number" min={15} max={480} step={15} value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} className="mt-2" />
              </label>
            </div>
            <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] p-4 text-sm text-violet-100">
              Break reminders are planned every 60 minutes. Camera and microphone are used only while this session is running.
            </div>
            {status && <p role="alert" className="mt-4 text-sm text-rose-200">{status}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSetupOpen(false)}>Cancel</Button>
              <Button onClick={() => void startSession()}>Start study mode</Button>
            </div>
          </div>
        </div>
      )}

      {!setupOpen && (
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Now studying</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{subject}</h2>
              <p className="mt-1 text-sm text-zinc-500">{goal}</p>
            </div>
            <Button variant="secondary" onClick={stopSession}>End session</Button>
          </div>
          <div className="grid min-h-[560px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] lg:grid-cols-[1.25fr_0.75fr]">
            <div className="flex flex-col items-center justify-center border-b border-white/[0.07] p-6 text-center lg:border-b-0 lg:border-r">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">Time remaining</p>
              <div className="my-5 font-mono text-[clamp(4rem,13vw,9rem)] font-semibold leading-none tracking-[-0.08em] text-white">{formatTime(timeLeft)}</div>
              <CharacterStage speaking={speaking} listening={listening} thinking={false} caption={speaking ? 'Voice reminder' : listening ? 'Listening for you' : 'Stay with your goal'} />
              {breakNotice && <p className="mt-4 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">{breakNotice}</p>}
            </div>
            <div className="flex flex-col gap-4 p-5 sm:p-7">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <video ref={videoRef} autoPlay muted playsInline aria-label="Study camera preview" className="aspect-video w-full object-cover" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">Focus monitor</p>
                  <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${
                    modelConnection === 'CONNECTED'
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                      : modelConnection === 'CHECKING'
                        ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                        : 'border-rose-400/30 bg-rose-400/10 text-rose-200'
                  }`}>
                    {modelConnection === 'CONNECTED' ? 'ML connected' : modelConnection === 'CHECKING' ? 'Connecting' : 'ML disconnected'}
                  </span>
                </div>
                <p className={`mt-2 text-lg font-semibold ${focusState === 'FOCUSED' ? 'text-emerald-300' : focusState === 'UNKNOWN' ? 'text-zinc-300' : 'text-amber-200'}`}>{focusLabels[focusState]}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{modelConnection === 'CONNECTED' ? 'The model treats a still seated student as focused and only flags sustained external distractions.' : 'Camera is active, but the ML endpoint is not connected. No focus judgment is being made.'}</p>
              </div>
              {permissionDenied && <p role="alert" className="text-sm text-rose-200">Camera or microphone permission is required to continue monitoring.</p>}
              {status && <p className="text-xs text-zinc-500">{status}</p>}
            </div>
          </div>
        </div>
      )}

      {!sessionActive && !setupOpen && hasSession && (
        <div className="mx-auto mt-6 max-w-xl text-center">
          <p className="text-zinc-400">Session finished. Ready for another focused block?</p>
          <Button className="mt-4" onClick={() => { setSetupOpen(true); setStatus(''); }}>Create another session</Button>
        </div>
      )}

      {!sessionActive && !setupOpen && !hasSession && (
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-zinc-400">Study mode is ready when you are.</p>
          <Button className="mt-4" onClick={() => setSetupOpen(true)}>Create a study session</Button>
        </div>
      )}
    </div>
  );
}
