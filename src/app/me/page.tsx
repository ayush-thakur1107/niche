import React from 'react';
import Link from 'next/link';
import { User, Compass, Sparkles, Share2, Layers, ArrowRight } from 'lucide-react';
import { getAllNodes, getAllConnections, getUniverseStats } from '@/lib/storage';
import { LEARNING_STATE_LABELS, LearningState } from '@/lib/types';
import { SpotifyLayerCard } from '@/components/audio/SpotifyLayerCard';
import { NodeCard } from '@/components/cards/NodeCard';
import styles from '../page.module.css';

export default function MePage() {
  const nodes = getAllNodes();
  const connections = getAllConnections();
  const stats = getUniverseStats();

  // Calculate connection degrees for each node
  const degrees: Record<string, number> = {};
  connections.forEach(c => {
    degrees[c.sourceNodeId] = (degrees[c.sourceNodeId] || 0) + 1;
    degrees[c.targetNodeId] = (degrees[c.targetNodeId] || 0) + 1;
  });

  // Top intellectual hubs
  const hubs = [...nodes]
    .sort((a, b) => (degrees[b.id] || 0) - (degrees[a.id] || 0))
    .slice(0, 5);

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Atlas of Self · Ayush Thakur</span>
          </div>
          <h1 className={styles.heroHeadline}>ME (ATLAS OF SELF)</h1>
          <p className={styles.heroSubline}>
            “Not a résumé, not a portfolio. A mirror of what I have understood, loved, questioned, and become.”
          </p>
        </div>
      </header>

      {/* Anti-Performance Principle Callout (Section 59) */}
      <section className={styles.spotlightCard}>
        <div>
          <div style={{ color: 'var(--accent-gold)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            THE ANTI-PERFORMANCE PRINCIPLE
          </div>
          <div className={styles.spotlightTitle} style={{ fontSize: '1.4rem' }}>
            Built Exclusively For One Person: Future Me.
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            No followers, public streaks, or vanity optimization. The goal is personal clarity, historical self-reflection, and intellectual honesty.
          </p>
        </div>
      </section>

      {/* Section 96: What is My Niche? */}
      <section
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
          <Sparkles size={16} />
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            SYNTHESIS HYPOTHESIS: WHAT IS MY NICHE?
          </span>
        </div>

        {nodes.length > 0 ? (
          <>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
              Emerging intellectual gravity: {nodes.slice(0, 5).map(n => n.title).join(' × ')}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '850px' }}>
              Your universe currently clusters around {nodes.length} entities. This synthesis evolves organically as you forge connections across disciplines.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
              Your Universe is a Pristine Blank Slate
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '850px' }}>
              As you populate your Atlas with cinema, literature, ideas, physical disciplines, and roadmaps, your emergent intellectual niche and curiosity gravity will automatically synthesize here.
            </p>
          </>
        )}
      </section>

      {/* Section 16: Personal Audio Layer (Spotify) */}
      <SpotifyLayerCard />

      {/* Intellectual Hubs (Section 95: Interest Gravity) */}
      <section>
        <div className={styles.sectionTitle}>
          <Layers size={14} color="var(--accent-gold)" />
          <span>Top Intellectual Hubs (Most Connected Nodes)</span>
        </div>

        {hubs.length > 0 ? (
          <div className={styles.nodesGrid}>
            {hubs.map(node => (
              <NodeCard
                key={node.id}
                node={node}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.015)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
          >
            No connected nodes recorded yet. Place and interconnect entities on the Atlas canvas.
          </div>
        )}
      </section>

      {/* Competence & Learning State Spectrum (Section 57) */}
      <section>
        <div className={styles.sectionTitle}>
          <Compass size={14} color="var(--accent-gold)" />
          <span>Learning State Spectrum (0 to 7 Competence)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          {([0, 1, 2, 3, 4, 5, 6, 7] as LearningState[]).map(lvl => (
            <div
              key={lvl}
              style={{
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                {stats.learningStates[lvl] || 0}
              </div>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Lvl {lvl}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {LEARNING_STATE_LABELS[lvl]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
