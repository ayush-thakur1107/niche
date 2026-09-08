'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useInteractionStore } from '../store';

export interface CoverFlowItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  onClick?: () => void;
  year?: string | number;
}

interface CoverFlowProps {
  items: CoverFlowItem[];
  initialIndex?: number;
  height?: number;
  className?: string;
  onSelect?: (item: CoverFlowItem, index: number) => void;
}

export function CoverFlow({
  items,
  initialIndex = 0,
  height = 420,
  className = '',
  onSelect
}: CoverFlowProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(initialIndex, 0), items.length - 1)
  );
  const { setCursor, resetCursor } = useInteractionStore();

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(items.length - 1, prev + 1));
  };

  const handleCardClick = (idx: number) => {
    if (idx === activeIndex) {
      if (items[idx]?.onClick) {
        items[idx].onClick!();
      } else if (onSelect) {
        onSelect(items[idx], idx);
      }
    } else {
      setActiveIndex(idx);
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        perspective: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Cards container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `${height - 90}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d'
        }}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);

          // Calculate 3D transforms based on distance from center
          const rotateY = offset > 0 ? -42 : offset < 0 ? 42 : 0;
          const translateX = offset * 190;
          const translateZ = -absOffset * 180;
          const scale = 1 - Math.min(absOffset * 0.12, 0.4);
          const opacity = Math.max(1 - absOffset * 0.25, 0.2);
          const zIndex = 50 - absOffset;

          const isActive = index === activeIndex;

          return (
            <motion.div
              key={item.id}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity
              }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 32
              }}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => {
                if (isActive) {
                  setCursor('WATCH', 'EXPLORE');
                } else {
                  setCursor('PAN', 'CENTER');
                }
              }}
              onMouseLeave={resetCursor}
              style={{
                position: 'absolute',
                width: '230px',
                height: '330px',
                borderRadius: '16px',
                cursor: 'pointer',
                zIndex: zIndex,
                transformStyle: 'preserve-3d',
                boxShadow: isActive
                  ? '0 28px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(226, 168, 87, 0.22)'
                  : '0 15px 30px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: isActive
                    ? '1.5px solid rgba(226, 168, 87, 0.7)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: '#0d0d12'
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isActive ? 'none' : 'brightness(0.6) saturate(0.8)'
                  }}
                />

                {/* Ambient vignette overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(8, 8, 10, 0.95) 0%, rgba(8, 8, 10, 0.3) 45%, transparent 100%)'
                  }}
                />

                {/* Badges and metadata */}
                {item.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#e2a857',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.badge}
                  </div>
                )}

                {item.year && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '6px',
                      padding: '3px 7px',
                      fontSize: '0.68rem',
                      color: '#a0a0ab'
                    }}
                  >
                    {item.year}
                  </div>
                )}

                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    right: '14px'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.94rem',
                      fontWeight: 650,
                      color: '#ffffff',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#a0a0ab',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>

                {/* Reflection effect at bottom */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '35%',
                    background:
                      'linear-gradient(to top, rgba(226, 168, 87, 0.12), transparent)',
                    pointerEvents: 'none',
                    opacity: isActive ? 1 : 0
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '10px'
        }}
      >
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeIndex === 0 ? '#444' : '#fff',
            cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: idx === activeIndex ? '22px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: idx === activeIndex ? '#e2a857' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={activeIndex === items.length - 1}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeIndex === items.length - 1 ? '#444' : '#fff',
            cursor: activeIndex === items.length - 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
