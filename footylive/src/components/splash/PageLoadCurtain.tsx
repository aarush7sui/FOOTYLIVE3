'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PageLoadCurtainProps {
  onComplete?: () => void;
  replayTrigger?: number;
}

export const PageLoadCurtain: React.FC<PageLoadCurtainProps> = ({
  onComplete,
  replayTrigger = 0,
}) => {
  const [stage, setStage] = useState<'showing' | 'fading' | 'finished'>('showing');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    // Reset whenever replayTrigger changes
    setStage('showing');

    if (prefersReducedMotion) {
      // Reduced motion: skip animation, hold briefly, then disappear
      const timer = setTimeout(() => {
        setStage('finished');
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }

    // Step 1: After ~900ms, start fade out over 700ms
    const fadeTimer = setTimeout(() => {
      setStage('fading');
    }, 900);

    // Step 2: After 900ms + 700ms = 1600ms, become pointer-events: none / finished
    const finishTimer = setTimeout(() => {
      setStage('finished');
      onComplete?.();
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [replayTrigger, prefersReducedMotion, onComplete]);

  if (stage === 'finished') {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#0d0e12] select-none transition-opacity duration-700 ease-out ${
        stage === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        transitionProperty: 'opacity',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
      }}
    >
      {/* Background stadium atmospheric glow in brand neon green */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#00ff88]/10 blur-[120px]" />
      </div>

      {/* Centered Brand Text: "FOOTYLive" in Minecraft Font with Neon Green web design accents */}
      <div className="relative flex items-center justify-center w-full px-4 text-center">
        {prefersReducedMotion ? (
          <h1
            className="font-minecraft text-[12vw] sm:text-[14vw] leading-none uppercase select-none tracking-tight"
            style={{
              textShadow: '4px 4px 0px #042917, 0 0 25px rgba(0, 255, 136, 0.75)',
            }}
          >
            <span className="text-white">FOOTY</span>
            <span className="text-[#00ff88]">LIVE</span>
          </h1>
        ) : (
          <motion.h1
            initial={{
              opacity: 0,
              scale: 0.85,
              letterSpacing: '-4px',
            }}
            animate={{
              opacity: [0, 1, 1],
              scale: [0.85, 1.02, 1],
              letterSpacing: ['-4px', '2px', '0px'],
            }}
            transition={{
              duration: 2.5,
              times: [0, 0.6, 1],
              ease: 'easeOut',
            }}
            className="font-minecraft text-[12vw] sm:text-[14vw] leading-none uppercase select-none tracking-tight"
            style={{
              textRendering: 'geometricPrecision',
              transformOrigin: 'center center',
              textShadow: '4px 4px 0px #042917, 0 0 30px rgba(0, 255, 136, 0.8), 0 0 60px rgba(0, 255, 136, 0.4)',
            }}
          >
            <span className="text-white">FOOTY</span>
            <span className="text-[#00ff88]">LIVE</span>
          </motion.h1>
        )}
      </div>

      {/* Subtle scanline / pixel texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.05) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  );
};
