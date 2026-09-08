'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Sparkles, BookOpen, Film, Lightbulb, Atom, Compass } from 'lucide-react';
import { useInteractionStore } from '../store';

export interface MorphAction {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  onClick: () => void;
  color?: string;
}

interface MorphButtonProps {
  label?: string;
  actions?: MorphAction[];
  className?: string;
}

export function MorphButton({
  label = 'Create in Universe',
  actions = [],
  className = ''
}: MorphButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useInteractionStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const defaultActions: MorphAction[] = actions.length > 0 ? actions : [
    {
      id: 'node',
      label: 'New Node',
      sublabel: 'Entity in the knowledge graph',
      icon: Compass,
      color: '#e2a857',
      onClick: () => window.location.href = '/atlas'
    },
    {
      id: 'idea',
      label: 'Intellectual Thesis',
      sublabel: 'A thesis, belief or evolving thought',
      icon: Lightbulb,
      color: '#93c5fd',
      onClick: () => window.location.href = '/ideas'
    },
    {
      id: 'cinema',
      label: 'Cinema Work',
      sublabel: 'Cinematic artifact or film study',
      icon: Film,
      color: '#f87171',
      onClick: () => window.location.href = '/cinema'
    },
    {
      id: 'book',
      label: 'Book Specimen',
      sublabel: 'Literary or philosophical text',
      icon: BookOpen,
      color: '#34d399',
      onClick: () => window.location.href = '/library'
    },
    {
      id: 'physics',
      label: 'Physics Experiment',
      sublabel: 'Scientific simulation & math model',
      icon: Atom,
      color: '#a78bfa',
      onClick: () => window.location.href = '/physics'
    }
  ];

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      className={className}
    >
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 32
        }}
        style={{
          borderRadius: isOpen ? '16px' : '28px',
          background: isOpen
            ? 'linear-gradient(135deg, rgba(22, 22, 29, 0.95), rgba(12, 12, 16, 0.98))'
            : 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
          border: isOpen ? '1px solid rgba(226, 168, 87, 0.3)' : '1px solid rgba(226, 168, 87, 0.6)',
          boxShadow: isOpen
            ? '0 20px 48px rgba(0, 0, 0, 0.7), 0 0 30px rgba(226, 168, 87, 0.12)'
            : '0 4px 18px rgba(226, 168, 87, 0.25)',
          overflow: 'hidden',
          zIndex: isOpen ? 50 : 1
        }}
      >
        {!isOpen ? (
          <motion.button
            layout="position"
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setCursor('EXPLORE', 'EXPAND')}
            onMouseLeave={resetCursor}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              color: '#08080a',
              fontFamily: 'var(--font-display, Inter, sans-serif)',
              fontSize: '0.86rem',
              fontWeight: 650,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <Plus size={16} strokeWidth={2.6} />
            </motion.div>
            <span>{label}</span>
          </motion.button>
        ) : (
          <motion.div
            layout="position"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            style={{
              padding: '18px 20px',
              minWidth: '320px',
              maxWidth: '380px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color="#e2a857" />
                <span
                  style={{
                    fontSize: '0.74rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#e2a857',
                    fontWeight: 600
                  }}
                >
                  Create Artifact
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a0a0ab',
                  cursor: 'pointer'
                }}
              >
                <X size={13} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {defaultActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      x: 4
                    }}
                    onClick={() => {
                      setIsOpen(false);
                      action.onClick();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#f0f0f5',
                      width: '100%'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={16} color={action.color || '#e2a857'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 550,
                          color: '#f0f0f5'
                        }}
                      >
                        {action.label}
                      </div>
                      {action.sublabel && (
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: '#8b8b99',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {action.sublabel}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
