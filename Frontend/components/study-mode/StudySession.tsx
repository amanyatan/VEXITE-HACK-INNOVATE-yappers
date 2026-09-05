'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const focusLabels = {
  FOCUSED: 'Focused',
  DISTRACTED: 'Needs a reset',
  PHONE_LIKELY: 'Phone likely',
  ABSENT: 'Away from screen',
};

export function StudySession() {
  const [subject, setSubject] = useState('Machine Learning');
  const [goal, setGoal] = useState('Finish neural network basics');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [focusState, setFocusState] = useState<'FOCUSED' | 'DISTRACTED' | 'PHONE_LIKELY' | 'ABSENT'>('FOCUSED');
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!sessionActive) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sessionActive]);

  useEffect(() => {
    if (!sessionActive) return;

    const cycle = window.setInterval(() => {
      const states: Array<'FOCUSED' | 'DISTRACTED' | 'PHONE_LIKELY' | 'ABSENT'> = ['FOCUSED', 'DISTRACTED', 'PHONE_LIKELY', 'FOCUSED', 'ABSENT'];
      setFocusState(states[Math.floor(Math.random() * states.length)]);
    }, 2200);

    return () => window.clearInterval(cycle);
  }, [sessionActive]);

  useEffect(() => {
    if (!cameraReady || !videoRef.current) return;

    const stream = videoRef.current.srcObject as MediaStream | null;
    if (!stream) return;

    return () => {
      stream.getTracks().forEach((track) => track.stop());
    };
  }, [cameraReady]);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
      setPermissionDenied(false);
      setSessionActive(true);
    } catch {
      setPermissionDenied(true);
      setCameraReady(false);
      setSessionActive(false);
    }
  };

  const stopSession = () => {
    setSessionActive(false);
    setCameraReady(false);
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTimeLeft(durationMinutes * 60);
    setFocusState('FOCUSED');
  };

  const minutesDisplay = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secondsDisplay = String(timeLeft % 60).padStart(2, '0');
  const focusTone = focusState === 'FOCUSED' ? 'text-emerald-300' : focusState === 'PHONE_LIKELY' ? 'text-amber-300' : 'text-rose-300';

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-slate-300">
            Subject
            <Input value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2" />
          </label>
          <label className="text-sm text-slate-300">
            Goal
            <Input value={goal} onChange={(event) => setGoal(event.target.value)} className="mt-2" />
          </label>
          <label className="text-sm text-slate-300">
            Duration (mins)
            <Input type="number" min={15} value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} className="mt-2" />
          </label>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Study session</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">{subject}</h3>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100">
            {minutesDisplay}:{secondsDisplay}
          </div>
        </div>

        {!cameraReady && !permissionDenied && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
            <p className="text-lg font-medium text-white">Why camera access?</p>
            <p className="mt-2 text-sm text-slate-300">Yappers uses your camera only during Study Mode to estimate whether you are focused. Your video is processed locally and not saved by default.</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button onClick={() => void requestCamera()}>Allow Camera</Button>
              <Button variant="secondary" onClick={() => setPermissionDenied(true)}>Not now</Button>
            </div>
          </div>
        )}

        {permissionDenied && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-amber-100">
            Camera access is required for focus detection. You can return later and start Study Mode when camera access is available.
          </div>
        )}

        {cameraReady && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              <video ref={videoRef} autoPlay muted playsInline className="h-72 w-full object-cover" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus status</p>
                <div className={`mt-3 text-xl font-semibold ${focusTone}`}>{focusLabels[focusState]}</div>
                <p className="mt-2 text-sm text-slate-300">{goal}</p>
              </div>

              {focusState === 'PHONE_LIKELY' && (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
                  Bhai padh le 😭 kal paper hai.
                </div>
              )}

              <Button variant="secondary" className="w-full" onClick={stopSession}>Stop session</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
