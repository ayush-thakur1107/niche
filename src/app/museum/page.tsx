'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Archive,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Filter,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  BookOpen,
  Code2,
  FlaskConical,
  Flame,
  Tag
} from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import { TextScramble } from '@/interaction/text/TextScramble';

type SpecimenStatus = 'ALL' | 'ABANDONED' | 'PAUSED' | 'ARCHIVED' | 'COMPLETED';
type SpecimenCategory = 'ALL' | 'PROJECT' | 'IDEA' | 'BOOK' | 'EXPERIMENT' | 'SKILL';

interface MuseumSpecimen {
  id: string;
  accessionNo: string;
  title: string;
  category: 'PROJECT' | 'IDEA' | 'BOOK' | 'EXPERIMENT' | 'SKILL';
  status: 'ABANDONED' | 'PAUSED' | 'ARCHIVED' | 'COMPLETED';
  dateInitiated: string;
  dateArchived: string;
  description: string;
  autopsy: string; // The post-mortem explanation
  revivalPotential: number; // 0 to 100%
  lessonsLearned: string[];
  tags: string[];
}

const INITIAL_SPECIMENS: MuseumSpecimen[] = [
  {
    id: 'specimen-1',
    accessionNo: 'NM-SPEC-081',
    title: 'Custom Lisp Interpreter in Rust',
    category: 'PROJECT',
    status: 'ABANDONED',
    dateInitiated: 'October 2024',
    dateArchived: 'December 2024',
    description: 'Attempted to build a pure tree-walking Lisp dialect from scratch with lexical scoping and tail-call optimization in Rust.',
    autopsy: 'Hit borrow checker friction during macro expansion closures. Realized the mental energy was being consumed by Rust lifetime annotations rather than language design fundamentals.',
    revivalPotential: 35,
    lessonsLearned: [
      'Build first prototype in TypeScript or Python before porting to systems language',
      'Macro hygiene requires dedicated intermediate representation',
      'Abandonment was the correct choice: saved 60 hours of compiler fighting'
    ],
    tags: ['Rust', 'Compilers', 'Lisp', 'AST']
  },
  {
    id: 'specimen-2',
    accessionNo: 'NM-SPEC-044',
    title: 'Hyperbolic Geometry Poincaré Disk for Graph Layouts',
    category: 'EXPERIMENT',
    status: 'PAUSED',
    dateInitiated: 'January 2025',
    dateArchived: 'February 2025',
    description: 'Experimenting with non-Euclidean hyperbolic space to compress millions of interconnected nodes without visual edge overlap.',
    autopsy: 'Möbius transformations worked in 2D canvas, but coordinate projection into WebGL shaders introduced floating point jitter at disk boundary.',
    revivalPotential: 82,
    lessonsLearned: [
      'Hyperbolic distance metrics work extraordinarily well for hierarchical trees',
      'Need to precompute conformal coordinates rather than calculate every frame'
    ],
    tags: ['Non-Euclidean', 'Math', 'Poincaré', 'WebGL']
  },
  {
    id: 'specimen-3',
    accessionNo: 'NM-SPEC-019',
    title: 'Finnegans Wake by James Joyce',
    category: 'BOOK',
    status: 'ABANDONED',
    dateInitiated: 'August 2024',
    dateArchived: 'September 2024',
    description: 'Attempted uninterrupted cover-to-cover reading of Joyce’s multilingual polyglot masterpiece.',
    autopsy: 'Reached page 142. Found that reading at 3 pages per hour with a secondary annotated lexicon disrupted intuitive aesthetic flow. Acknowledged as a museum curiosity rather than mandatory reading.',
    revivalPotential: 15,
    lessonsLearned: [
      'Not all classic literature yields proportional return on attentional capital',
      'Admitting defeat in a book is an act of intellectual liberation'
    ],
    tags: ['Modernism', 'Literature', 'James Joyce']
  },
  {
    id: 'specimen-4',
    accessionNo: 'NM-SPEC-092',
    title: 'Chola Maritime Fleet GIS Interactive Map',
    category: 'PROJECT',
    status: 'PAUSED',
    dateInitiated: 'November 2024',
    dateArchived: 'January 2025',
    description: 'An interactive historical timeline map rendering Monsoon wind currents and Rajendra Chola’s naval armada through the Malacca Strait.',
    autopsy: 'Paused due to lack of high-resolution 11th-century bathymetric coastline shapefiles. Paused pending academic GIS data acquisition.',
    revivalPotential: 90,
    lessonsLearned: [
      'Historical cartography requires scholarly vector data sources, not standard Google Maps tiles',
      'Seasonal monsoon currents dictate naval routes with mathematical predictability'
    ],
    tags: ['Chola Dynasty', 'Maritime', 'Cartography', 'GIS']
  },
  {
    id: 'specimen-5',
    accessionNo: 'NM-SPEC-012',
    title: 'Handstand Press Progression',
    category: 'SKILL',
    status: 'COMPLETED',
    dateInitiated: 'March 2024',
    dateArchived: 'November 2024',
    description: 'Mastery of free-standing bent-arm to straight-arm handstand press from straddle position.',
    autopsy: 'Successfully integrated into daily warmup. Required 8 months of scapular depression conditioning and hamstring compression flexibility.',
    revivalPotential: 100,
    lessonsLearned: [
      'Frequency over intensity: 10 minutes every day beats 2 hours on Sunday',
      'Shoulder mobility was the real bottleneck, not wrist strength'
    ],
    tags: ['Calisthenics', 'Biomechanics', 'Discipline']
  }
];

export default function MuseumPage() {
  const [specimens, setSpecimens] = useState<MuseumSpecimen[]>(INITIAL_SPECIMENS);
  const [selectedStatus, setSelectedStatus] = useState<SpecimenStatus>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<SpecimenCategory>('ALL');
  const [activeSpecimen, setActiveSpecimen] = useState<MuseumSpecimen | null>(null);

  const { setCursor, resetCursor } = useInteractionStore();

  const filtered = specimens.filter((s) => {
    if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    return true;
  });

  const getStatusBadge = (status: MuseumSpecimen['status']) => {
    switch (status) {
      case 'ABANDONED':
        return {
          label: 'ABANDONED',
          color: '#f87171',
          bg: 'rgba(248, 113, 113, 0.15)',
          border: 'rgba(248, 113, 113, 0.3)',
          icon: XCircle
        };
      case 'PAUSED':
        return {
          label: 'PAUSED',
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.3)',
          icon: PauseCircle
        };
      case 'COMPLETED':
        return {
          label: 'COMPLETED',
          color: '#34d399',
          bg: 'rgba(52, 211, 153, 0.15)',
          border: 'rgba(52, 211, 153, 0.3)',
          icon: CheckCircle2
        };
      case 'ARCHIVED':
      default:
        return {
          label: 'ARCHIVED',
          color: '#94a3b8',
          bg: 'rgba(148, 163, 184, 0.15)',
          border: 'rgba(148, 163, 184, 0.3)',
          icon: Clock
        };
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070709',
        color: '#f0f0f5',
        padding: '40px 44px 140px 44px',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '24px',
          marginBottom: '28px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#e2a857',
            fontWeight: 650,
            marginBottom: '6px'
          }}
        >
          <Archive size={15} />
          <span>Phase 12 · Archival Provenance & Curiosity Cemetery</span>
        </div>
        <h1
          style={{
            fontSize: '2.4rem',
            fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 8px 0'
          }}
        >
          <TextScramble text="Museum of Abandoned & Preserved Curiosities" />
        </h1>
        <p
          style={{
            color: '#8b8b99',
            fontSize: '0.9rem',
            maxWidth: '720px',
            lineHeight: 1.5,
            margin: 0
          }}
        >
          Everything you’ve ever begun, paused, or abandoned with honor.
          A project abandoned with an honest autopsy is a triumph of taste over sunk-cost fallacy.
        </p>

        {/* Counter telemetry bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginTop: '22px'
          }}
        >
          <div
            style={{
              background: 'rgba(18, 18, 24, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '12px 16px'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#8e8e9c', textTransform: 'uppercase' }}>
              Specimens Cataloged
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f0f0f5', marginTop: '2px' }}>
              {specimens.length}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(18, 18, 24, 0.6)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              borderRadius: '10px',
              padding: '12px 16px'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#f87171', textTransform: 'uppercase' }}>
              Abandoned with Honor
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f87171', marginTop: '2px' }}>
              {specimens.filter((s) => s.status === 'ABANDONED').length}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(18, 18, 24, 0.6)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '10px',
              padding: '12px 16px'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#f59e0b', textTransform: 'uppercase' }}>
              Paused (Dormant)
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>
              {specimens.filter((s) => s.status === 'PAUSED').length}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(18, 18, 24, 0.6)',
              border: '1px solid rgba(52, 211, 153, 0.2)',
              borderRadius: '10px',
              padding: '12px 16px'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase' }}>
              Mastered & Completed
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
              {specimens.filter((s) => s.status === 'COMPLETED').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}
      >
        <span
          style={{
            fontSize: '0.74rem',
            color: '#8b8b99',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginRight: '6px'
          }}
        >
          Filter State:
        </span>

        {(['ALL', 'ABANDONED', 'PAUSED', 'COMPLETED'] as SpecimenStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 600,
              background:
                selectedStatus === status
                  ? 'rgba(226, 168, 87, 0.15)'
                  : 'rgba(255, 255, 255, 0.04)',
              border:
                selectedStatus === status
                  ? '1px solid #e2a857'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              color: selectedStatus === status ? '#e2a857' : '#9ca3af',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Specimen Catalog Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}
      >
        {filtered.map((specimen) => {
          const badge = getStatusBadge(specimen.status);
          const BadgeIcon = badge.icon;

          return (
            <motion.div
              key={specimen.id}
              whileHover={{ y: -4, borderColor: 'rgba(226, 168, 87, 0.4)' }}
              onClick={() => setActiveSpecimen(specimen)}
              onMouseEnter={() => setCursor('OPEN', 'EXAMINE')}
              onMouseLeave={resetCursor}
              style={{
                background: 'rgba(14, 14, 20, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '22px 24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Card top bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.72rem',
                    color: '#e2a857',
                    letterSpacing: '0.06em'
                  }}
                >
                  {specimen.accessionNo}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    color: badge.color,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em'
                  }}
                >
                  <BadgeIcon size={12} />
                  <span>{badge.label}</span>
                </div>
              </div>

              {/* Title & category */}
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#8b8b99',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '4px'
                }}
              >
                {specimen.category}
              </div>
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 650,
                  color: '#ffffff',
                  margin: '0 0 10px 0',
                  lineHeight: 1.3
                }}
              >
                {specimen.title}
              </h3>

              <p
                style={{
                  fontSize: '0.82rem',
                  color: '#9ba1b0',
                  lineHeight: 1.5,
                  margin: '0 0 16px 0',
                  flex: 1
                }}
              >
                {specimen.description}
              </p>

              {/* Revival Potential meter */}
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: '#8e8e9c',
                    marginBottom: '4px'
                  }}
                >
                  <span>Revival Potential</span>
                  <span style={{ color: '#e2a857', fontWeight: 600 }}>{specimen.revivalPotential}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${specimen.revivalPotential}%`,
                      height: '100%',
                      background:
                        specimen.revivalPotential > 70
                          ? '#34d399'
                          : specimen.revivalPotential > 30
                          ? '#f59e0b'
                          : '#f87171'
                    }}
                  />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSpecimen(specimen);
                  }}
                  style={{
                    marginTop: '14px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(226, 168, 87, 0.08)',
                    border: '1px solid rgba(226, 168, 87, 0.25)',
                    color: '#e2a857',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <span>Inspect Post-Mortem Autopsy</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Specimen Detail Modal */}
      <AnimatePresence>
        {activeSpecimen && (
          <motion.div
            key="museum-specimen-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: '24px'
            }}
            onClick={() => setActiveSpecimen(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '680px',
                background: 'linear-gradient(145deg, #101016, #09090d)',
                border: '1px solid rgba(226, 168, 87, 0.3)',
                borderRadius: '18px',
                padding: '32px 36px',
                boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(226, 168, 87, 0.1)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}
              >
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.8rem',
                    color: '#e2a857'
                  }}
                >
                  {activeSpecimen.accessionNo} · {activeSpecimen.category}
                </span>
                <button
                  onClick={() => setActiveSpecimen(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              <h2
                style={{
                  fontSize: '1.8rem',
                  fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: '0 0 16px 0'
                }}
              >
                {activeSpecimen.title}
              </h2>

              {/* Timeline duration */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '0.78rem',
                  color: '#8b8b99',
                  marginBottom: '20px'
                }}
              >
                <span>Initiated: {activeSpecimen.dateInitiated}</span>
                <span>•</span>
                <span>Archived: {activeSpecimen.dateArchived}</span>
              </div>

              {/* The Autopsy */}
              <div
                style={{
                  background: 'rgba(248, 113, 113, 0.08)',
                  border: '1px solid rgba(248, 113, 113, 0.25)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '20px'
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#f87171',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6px'
                  }}
                >
                  Post-Mortem Autopsy Report
                </div>
                <p style={{ fontSize: '0.86rem', color: '#f3f4f6', lineHeight: 1.6, margin: 0 }}>
                  {activeSpecimen.autopsy}
                </p>
              </div>

              {/* Lessons Learned */}
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#e2a857',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '10px'
                  }}
                >
                  Intellectual Provenance (What Was Learned)
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  {activeSpecimen.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} style={{ fontSize: '0.84rem', color: '#d1d5db', lineHeight: 1.5 }}>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setActiveSpecimen(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f0f0f5',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Close Specimen
                </button>
                <button
                  onClick={() => {
                    alert(`Specimen "${activeSpecimen.title}" marked for intellectual resurrection!`);
                    setActiveSpecimen(null);
                  }}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
                    border: 'none',
                    color: '#08080a',
                    fontWeight: 650,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Revive in Active Universe
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
