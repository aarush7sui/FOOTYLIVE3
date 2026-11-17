'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
  rotation: number;
}

export const ParticleBurstContainer: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't burst if clicking pure inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const colors = ['#0055FF', '#FF3D00', '#00C853', '#FFD700', '#FFFFFF'];
      const newParticles: Particle[] = [];
      const particleCount = 14;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
        const velocity = Math.random() * 80 + 40;
        newParticles.push({
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * velocity,
          dy: Math.sin(angle) * velocity,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 7 + 4,
          rotation: Math.random() * 360,
        });
      }

      setParticles((prev) => [...prev.slice(-30), ...newParticles]);

      // Cleanup particles after 800ms
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
      }, 800);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: p.x + p.dx,
              y: p.y + p.dy + 35, // subtle gravity curve
              scale: 0,
              opacity: 0,
              rotate: p.rotation,
            }}
            transition={{
              duration: 0.75,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.id % 2 === 0 ? '50%' : '2px',
              boxShadow: `0 0 8px ${p.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
