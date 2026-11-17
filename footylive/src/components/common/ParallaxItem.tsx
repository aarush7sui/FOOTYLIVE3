'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface ParallaxItemProps {
  children: React.ReactNode;
  speed?: number; // e.g. -30 for upward offset, 40 for downward offset
  className?: string;
}

export const ParallaxItem: React.FC<ParallaxItemProps> = ({
  children,
  speed = 25,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const y = useSpring(rawY, { stiffness: 400, damping: 35 });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export const FloatingBackgroundGlows: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -250]);
  const y3 = useTransform(scrollY, [0, 2000], [0, 180]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-[#00ff88]/5 blur-[140px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/2 -right-32 h-[600px] w-[600px] rounded-full bg-[#0055ff]/5 blur-[160px]"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-1/4 left-10 h-[450px] w-[450px] rounded-full bg-[#ff3355]/4 blur-[130px]"
      />
    </div>
  );
};
