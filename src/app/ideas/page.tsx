import React from 'react';
import Link from 'next/link';
import { Lightbulb, Sparkles, ArrowRight, History } from 'lucide-react';
import { getAllNodes } from '@/lib/storage';
import styles from '../page.module.css';

export default function IdeasPage() {
  const allNodes = getAllNodes();
  const ideaNodes = allNodes.filter(
    n => n.type === 'PHILOSOPHY' || n.type === 'IDEA' || n.type === 'THEORY' || n.tags.includes('philosophy')
  );

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lightbulb size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Thinking Space & Hypotheses</span>
          </div>
          <h1 className={styles.heroHeadline}>IDEAS & BELIEFS</h1>
          <p className={styles.heroSubline}>
            “What I believe, what I question, and what I have changed my mind about.”
          </p>
        </div>
      </header>

      {/* Feature Callout: What I used to think */}
      <section className={styles.spotlightCard} style={{ borderLeftColor: 'var(--accent-amethyst)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amethyst)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            <History size={13} />
            <span>INTELLECTUAL EVOLUTION (WHAT I USED TO THINK)</span>
          </div>
          <div className={styles.spotlightTitle} style={{ fontSize: '1.4rem' }}>
            Preserve Old Hypotheses Instead of Silently Erasing Them
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Every idea node supports multiple versions. When your stance shifts, the system keeps the past record as evidence of personal growth.
          </p>
        </div>
      </section>

      <section>
        <div className={styles.sectionTitle}>Active Philosophical Nodes & Hypotheses</div>
        <div className={styles.nodesGrid}>
          {ideaNodes.map(idea => (
            <Link key={idea.id} href={`/node/${idea.slug || idea.id}`} className={styles.nodeCard}>
              <div className={styles.nodeHeader}>
                <span className="badge" style={{ color: '#c678dd', borderColor: 'rgba(198,120,221,0.4)' }}>
                  {idea.type}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lvl {idea.learningState}</span>
              </div>
              <div className={styles.nodeTitle}>{idea.title}</div>
              <p className={styles.nodeSummary}>{idea.summary}</p>
              {idea.whyCare && (
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontStyle: 'italic', marginTop: '6px' }}>
                  “{idea.whyCare}”
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                  {idea.uncertaintyLevel.replace('_', ' ')}
                </span>
                <ArrowRight size={13} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
