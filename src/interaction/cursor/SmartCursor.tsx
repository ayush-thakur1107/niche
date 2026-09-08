'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useInteractionStore } from '../store';
import styles from './SmartCursor.module.css';

export function SmartCursor() {
  const { cursorMode, cursorText } = useInteractionStore();
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy physics spring for organic following
  const springConfig = { damping: 28, stiffness: 450, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  const isSpecial = cursorMode !== 'DEFAULT';
  const label = cursorText || cursorMode;

  if (cursorMode === 'HIDDEN' || !isVisible || !isSpecial) return null;

  return (
    <motion.div
      className={`${styles.cursor} ${isSpecial ? styles.cursorExpanded : styles.cursorDefault}`}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%'
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isSpecial ? 1 : 1,
        opacity: 1,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
    >
      {isSpecial && <span>{label}</span>}
    </motion.div>
  );
}
