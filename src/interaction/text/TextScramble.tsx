'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  speed?: number;
}

const GLYPHS = 'АБВГДЕЖЗИЙКЛMNOPQRSTUVWXYZ0123456789_—·≠≈∞§';

export function TextScramble({
  text,
  className,
  triggerOnHover = true,
  speed = 30
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);

  const scramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        isScramblingRef.current = false;
      }

      iteration += 1 / 2;
    }, speed);
  };

  useEffect(() => {
    scramble();
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={() => {
        if (triggerOnHover) scramble();
      }}
      style={{ cursor: triggerOnHover ? 'default' : 'inherit' }}
    >
      {displayText}
    </span>
  );
}
