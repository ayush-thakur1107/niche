'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  Film,
  BookA,
  Lightbulb,
  Atom,
  Archive,
  ArrowUpRight,
  Shuffle
} from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';

export function UniverseFooter() {
  const router = useRouter();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [isSerendipityOpen, setIsSerendipityOpen] = useState<boolean>(false);
  const [serendipityArtifact, setSerendipityArtifact] = useState<{
    title: string;
    type: string;
    href: string;
    quote: string;
    color: string;
  } | null>(null);

  const { setCursor, resetCursor } = useInteractionStore();

  const exploreActions = [
    {
      id: 'random-node',
      label: 'Random Node',
      type: 'ATLAS',
      icon: Compass,
      color: '#e2a857',
      onClick: async () => {
        try {
          const res = await fetch('/api/nodes');
          const data = await res.json();
          if (data && data.nodes && data.nodes.length > 0) {
            const random = data.nodes[Math.floor(Math.random() * data.nodes.length)];
            router.push(`/node/${random.slug || random.id}`);
          } else {
            router.push('/atlas');
          }
        } catch {
          router.push('/atlas');
        }
      }
    },
    {
      id: 'cinema',
      label: 'Cinema Work',
      type: 'CINEMA',
      icon: Film,
      color: '#f87171',
      onClick: () => router.push('/cinema')
    },
    {
      id: 'physics',
      label: 'Orbital Field',
      type: 'PHYSICS',
      icon: Atom,
      color: '#38bdf8',
      onClick: () => router.push('/physics')
    },
    {
      id: 'vocabulary',
      label: 'Lexicon Specimen',
      type: 'LANGUAGE',
      icon: BookA,
      color: '#34d399',
      onClick: () => router.push('/vocabulary')
    },
    {
      id: 'museum',
      label: 'Abandoned Curiosity',
      type: 'MUSEUM',
      icon: Archive,
      color: '#c084fc',
      onClick: () => router.push('/museum')
    },
    {
      id: 'serendipity',
      label: 'Serendipity Leap',
      type: 'SYNCHRONICITY',
      icon: Sparkles,
      color: '#f59e0b',
      onClick: () => {
        const artifacts = [
          {
            title: 'Chola Naval Armada & Monsoon Vector Mechanics',
            type: 'HISTORY · PHYSICS',
            href: '/node/chola-dynasty',
            quote: 'How seasonal Indian Ocean trade winds governed 11th-century Southeast Asian naval hegemony.',
            color: '#e2a857'
          },
          {
            title: 'Albert Camus: The Absurd & Defiant Joy',
            type: 'PHILOSOPHY · LITERATURE',
            href: '/node/albert-camus',
            quote: 'One must imagine Sisyphus happy. The struggle itself toward the heights is enough to fill a man’s heart.',
            color: '#60a5fa'
          },
          {
            title: 'Blade Runner 2049: The Soul of Artificial Memory',
            type: 'CINEMA · IDENTITY',
            href: '/cinema',
            quote: 'Dying for the right cause. It’s the most human thing we can do.',
            color: '#f87171'
          },
          {
            title: 'Palimpsest: Memory Erased Yet Indelible',
            type: 'VOCABULARY · CONSCIOUSNESS',
            href: '/vocabulary',
            quote: 'Something reused or altered but still bearing visible traces of its earlier form.',
            color: '#34d399'
          }
        ];
        const pick = artifacts[Math.floor(Math.random() * artifacts.length)];
        setSerendipityArtifact(pick);
        setIsSerendipityOpen(true);
      }
    }
  ];

  return (
    <footer
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #070709 0%, #030305 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '60px 48px 140px 48px',
        overflow: 'hidden'
      }}
    >
      {/* Ambient background glow shifting on hover */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '350px',
          borderRadius: '50%',
          background: hoveredColor
            ? `radial-gradient(circle, ${hoveredColor}22 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(226, 168, 87, 0.06) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Top Header Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#e2a857',
                fontWeight: 700
              }}
            >
              KEEP EXPLORING
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>—</span>
            <span style={{ fontSize: '0.74rem', color: '#8e8e9c', letterSpacing: '0.04em' }}>
              The universe has no boundary
            </span>
          </div>

          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.72rem',
              color: '#8b8b99'
            }}
          >
            AYUSH THAKUR · ayushthakur.space
          </div>
        </div>

        {/* Command List (Railway Monospace Command Palette) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '40px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 0'
          }}
        >
          {exploreActions.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              onMouseEnter={() => {
                setHoveredColor(item.color);
                setCursor('EXPLORE', item.type);
              }}
              onMouseLeave={() => {
                setHoveredColor(null);
                resetCursor();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e4e4eb',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.74rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#e4e4eb';
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  boxShadow: `0 0 6px ${item.color}88`,
                  flexShrink: 0
                }}
              />
              <span style={{ color: 'var(--text-faint, #525360)' }}>[{item.type}]</span>
              <span style={{ fontWeight: 400 }}>{item.label}</span>
              <ArrowUpRight size={12} style={{ color: 'var(--text-faint, #525360)', marginLeft: '2px' }} />
            </button>
          ))}
        </div>

        {/* Footer bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.78rem',
            color: '#6e6e7c',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            paddingTop: '20px'
          }}
        >
          <div>
            Personal Digital Universe of <span style={{ color: '#d1d5db' }}>Ayush Thakur</span>.
            Continuous intellectual expansion across history, philosophy, cinema, code, and physical discipline.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/atlas" style={{ color: '#8e8e9c', textDecoration: 'none' }}>
              Atlas
            </Link>
            <Link href="/lab" style={{ color: '#8e8e9c', textDecoration: 'none' }}>
              Interaction Lab
            </Link>
            <Link href="/cinema" style={{ color: '#8e8e9c', textDecoration: 'none' }}>
              Cinema
            </Link>
            <Link href="/library" style={{ color: '#8e8e9c', textDecoration: 'none' }}>
              Library
            </Link>
            <Link href="/physics" style={{ color: '#8e8e9c', textDecoration: 'none' }}>
              Physics
            </Link>
            <Link href="/museum" style={{ color: '#8e8e9c', textDecoration: 'none' }}>
              Museum
            </Link>
            <Link href="/me" style={{ color: '#8e8e9c', textDecoration: 'none' }}>
              Me
            </Link>
          </div>
        </div>
      </div>

      {/* Serendipity Discovery Modal */}
      <AnimatePresence>
        {isSerendipityOpen && serendipityArtifact && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(20px)',
              padding: '24px'
            }}
            onClick={() => setIsSerendipityOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                background: 'linear-gradient(145deg, #121218, #09090d)',
                border: `1px solid ${serendipityArtifact.color}60`,
                borderRadius: '20px',
                padding: '36px',
                boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 50px ${serendipityArtifact.color}25`,
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: `${serendipityArtifact.color}15`,
                  border: `1px solid ${serendipityArtifact.color}40`,
                  color: serendipityArtifact.color,
                  fontSize: '0.74rem',
                  fontWeight: 650,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={14} />
                <span>Serendipity Leap</span>
              </div>

              <h2
                style={{
                  fontSize: '1.9rem',
                  fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: '0 0 16px 0',
                  lineHeight: 1.3
                }}
              >
                {serendipityArtifact.title}
              </h2>

              <p
                style={{
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: '#d1d5db',
                  lineHeight: 1.6,
                  marginBottom: '28px'
                }}
              >
                "{serendipityArtifact.quote}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <button
                  onClick={() => setIsSerendipityOpen(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f0f0f5',
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Dismiss
                </button>

                <button
                  onClick={() => {
                    setIsSerendipityOpen(false);
                    router.push(serendipityArtifact.href);
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${serendipityArtifact.color} 0%, #c48b3c 100%)`,
                    border: 'none',
                    color: '#08080a',
                    fontWeight: 650,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Explore Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
