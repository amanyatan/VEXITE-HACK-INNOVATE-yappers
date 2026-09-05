'use client';

import { AICharacter } from './AICharacter';

type CharacterStageProps = {
  speaking?: boolean;
  listening?: boolean;
  thinking?: boolean;
  caption?: string;
};

export function CharacterStage({ speaking, listening, thinking, caption }: CharacterStageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <AICharacter speaking={speaking} listening={listening} thinking={thinking} />
      <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <span key={index} className="wave-bar h-4 w-1 rounded-full bg-violet-400/70" style={{ animationDelay: `${index * 90}ms` }} />)}
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-zinc-500">{caption || (speaking ? 'Yappers is speaking' : listening ? 'Listening to you' : thinking ? 'Thinking it through' : 'Ready when you are')}</p>
    </div>
  );
}
