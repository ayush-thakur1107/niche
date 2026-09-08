'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lightbulb, History, Sparkles, ArrowRight, GitCommit, Split, Plus } from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import { CardTilt } from '@/interaction/cards/CardTilt';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { NodeItem } from '@/lib/types';
import { NodeCard } from '@/components/cards/NodeCard';
import styles from '../page.module.css';

interface EvolutionExample {
  topic: string;
  pastYear: string;
  pastBelief: string;
  currentYear: string;
  currentBelief: string;
  whyChanged: string;
}

const EVOLUTIONS: EvolutionExample[] = [];

export default function IdeasPage() {
  const { setCursor, resetCursor } = useInteractionStore();
  const [ideas, setIdeas] = useState<NodeItem[]>([]);
  const [selectedEvolution, setSelectedEvolution] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const ideaNodes = data.filter(
            n => n.type === 'PHILOSOPHY' || n.type === 'IDEA' || n.type === 'THEORY' || n.tags.includes('philosophy')
          );
          setIdeas(ideaNodes);
        }
      })
      .catch(() => {});
  }, []);

  const activeEvo = EVOLUTIONS[selectedEvolution];

  return (
    <div className={styles.container}>
      <header className={styles.hero} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lightbulb size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Thinking Space & Hypotheses</span>
          </div>
          <h1 className={styles.title}>IDEAS & BELIEFS</h1>
          <p className={styles.subtitle}>
            “What I believe, what I question, and what I have changed my mind about across time.”
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
            color: '#08080a',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            fontWeight: 650,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          <Plus size={14} />
          <span>New Thesis</span>
        </button>
      </header>

      {/* "What I Used to Think" Interactive Evolution Timeline */}
      {EVOLUTIONS.length > 0 && activeEvo && (
        <section
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amethyst)' }}>
            <History size={16} />
            <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              INTELLECTUAL EVOLUTION: “WHAT I USED TO THINK”
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {EVOLUTIONS.map((evo, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEvolution(idx)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  background: selectedEvolution === idx ? 'var(--accent-amethyst)' : 'var(--bg-surface-raised)',
                  color: selectedEvolution === idx ? 'var(--bg-abyss)' : 'var(--text-muted)',
                  fontWeight: selectedEvolution === idx ? 600 : 400,
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {evo.topic}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Past */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-faint)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <GitCommit size={13} />
              <span>WHAT I THOUGHT IN {activeEvo.pastYear}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.4, fontStyle: 'italic' }}>
              “{activeEvo.pastBelief}”
            </div>
          </div>

          {/* Current */}
          <div
            style={{
              background: 'rgba(168, 123, 230, 0.08)',
              border: '1px solid rgba(168, 123, 230, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amethyst)' }}>
              <Sparkles size={13} />
              <span>WHAT I BELIEVE NOW ({activeEvo.currentYear})</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.4, fontStyle: 'italic' }}>
              “{activeEvo.currentBelief}”
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-faint)', paddingTop: '10px' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Catalyst for change: </strong> {activeEvo.whyChanged}
        </div>
      </section>
      )}

      {/* Active Ideas Grid */}
      <section>
        <div className={styles.sectionTitle}>
          <span>Active Philosophical Frameworks & Hypotheses ({ideas.length})</span>
        </div>

        {ideas.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            <Lightbulb size={26} color="var(--accent-gold)" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
              No custom theses added yet
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 18px auto' }}>
              Record hypotheses, evolving stances, and foundational theses that govern your decisions.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
                color: '#08080a',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Record First Thesis</span>
            </button>
          </div>
        ) : (
          <div className={styles.nodesGrid}>
            {ideas.map(idea => (
              <NodeCard key={idea.id} node={idea} />
            ))}
          </div>
        )}
      </section>

      {/* Add Thesis Modal */}
      <CreateNodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="PHILOSOPHY"
        defaultTags={['philosophy', 'thesis', 'ideas']}
        onNodeCreated={(newNode) => {
          setIdeas(prev => [newNode, ...prev]);
        }}
      />
    </div>
  );
}
