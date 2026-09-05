'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      <div className="ambient-grid absolute inset-0 opacity-70" />
      <motion.div
        className="ambient-orb absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-violet-700/10 blur-3xl"
        animate={{ x: [0, 25, 0], y: [0, 18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-orb absolute -bottom-48 right-0 h-[32rem] w-[32rem] rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ x: [0, -22, 0], y: [0, -16, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
