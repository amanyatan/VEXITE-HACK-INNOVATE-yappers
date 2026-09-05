'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type AICharacterProps = {
  speaking?: boolean;
  listening?: boolean;
  thinking?: boolean;
  className?: string;
};

export function AICharacter({ speaking = false, listening = false, thinking = false, className = '' }: AICharacterProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = useMemo(() => Array.from({ length: 20 }, (_, index) => `/character/frame_${String(index + 1).padStart(2, '0')}.png`), []);

  useEffect(() => {
    if (!speaking) {
      return;
    }

    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 90);

    return () => window.clearInterval(interval);
  }, [frames.length, speaking]);

  const currentFrame = speaking ? frames[frameIndex % frames.length] ?? frames[0] : frames[0];
  const stateLabel = speaking ? 'Speaking' : listening ? 'Listening' : thinking ? 'Thinking' : 'Idle';

  return (
    <div className={`flex flex-col items-center ${className}`.trim()}>
      <div className={`pulse-ring relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border border-violet-400/20 bg-gradient-to-b from-violet-950/40 to-[#0a0a0a] shadow-[0_0_80px_rgba(139,92,246,0.18)] ${speaking ? 'ring-2 ring-violet-400/40' : ''}`}>
        <Image
          src={currentFrame}
          alt="Yappers character"
          width={224}
          height={224}
          className="h-full w-full object-cover"
          draggable={false}
          unoptimized
        />
        <div className="absolute bottom-4 rounded-full border border-violet-400/30 bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-200">
          {stateLabel}
        </div>
      </div>
    </div>
  );
}
