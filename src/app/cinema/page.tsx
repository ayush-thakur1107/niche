import React from 'react';
import Link from 'next/link';
import { Film, Star, ArrowRight } from 'lucide-react';
import { getAllNodes } from '@/lib/storage';
import styles from '../page.module.css';

export default function CinemaPage() {
  const allNodes = getAllNodes();
  const movieNodes = allNodes.filter(n => n.type === 'MOVIE' || n.tags.includes('movie') || n.tags.includes('film') || n.tags.includes('cinema'));

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Film size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Personal Cinematheque</span>
          </div>
          <h1 className={styles.heroHeadline}>CINEMATHEQUE</h1>
          <p className={styles.heroSubline}>
            “Film as visual philosophy, historical memory, and personal resonance.”
          </p>
        </div>
      </header>

      <section>
        <div className={styles.sectionTitle}>Watched & Canon Entries</div>
        {movieNodes.length > 0 ? (
          <div className={styles.nodesGrid}>
            {movieNodes.map(m => (
              <Link key={m.id} href={`/node/${m.slug || m.id}`} className={styles.nodeCard}>
                <div className={styles.nodeHeader}>
                  <span className="badge" style={{ color: '#e06c75', borderColor: 'rgba(224,108,117,0.4)' }}>FILM</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lvl {m.learningState}</span>
                </div>
                <div className={styles.nodeTitle}>{m.title}</div>
                <p className={styles.nodeSummary}>{m.summary}</p>
                {m.whyCare && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontStyle: 'italic', marginTop: '6px' }}>
                    “{m.whyCare}”
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                    {m.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
                  </span>
                  <ArrowRight size={13} color="var(--text-muted)" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No films logged yet. Click "+ New Node" in the sidebar and choose type "MOVIE" or press Cmd+K.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
