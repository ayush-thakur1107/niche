'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
  style?: React.CSSProperties;
  cursorColor?: string;
}

export function Typewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  delayBetweenWords = 2200,
  className = '',
  style = {},
  cursorColor = '#e2a857'
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const targetWord = words[currentWordIndex];

    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === targetWord) {
      // Pause before deleting if there are multiple words
      if (words.length > 1) {
        timer = setTimeout(() => setIsDeleting(true), delayBetweenWords);
      }
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? targetWord.substring(0, currentText.length - 1)
          : targetWord.substring(0, currentText.length + 1);
        setCurrentText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style
      }}
    >
      <span>{currentText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1.1em',
          backgroundColor: cursorColor,
          marginLeft: '4px',
          verticalAlign: 'text-bottom'
        }}
      />
    </span>
  );
}
