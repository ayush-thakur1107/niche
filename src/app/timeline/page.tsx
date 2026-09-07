import React from 'react';
import Link from 'next/link';
import { History, Calendar, ArrowRight } from 'lucide-react';
import { getTimelineEvents, getAllNodes } from '@/lib/storage';
import styles from '../page.module.css';

export default function TimelinePage() {
  const events = getTimelineEvents();
  const allNodes = getAllNodes();
  const nodeMap = new Map(allNodes.map(n => [n.id, n]));

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <History size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Personal Intellectual Chronology</span>
          </div>
          <h1 className={styles.heroHeadline}>TIMELINE</h1>
          <p className={styles.heroSubline}>
            “The evolution of understanding across time: when things were discovered, questioned, or mastered.”
          </p>
        </div>
      </header>

      <section>
        <div className={styles.sectionTitle}>Event Log & Discoveries</div>
        <div style={{ position: 'relative', borderLeft: '2px solid var(--border-subtle)', marginLeft: '16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {events.map(ev => {
            const linkedNode = ev.entityType === 'NODE' ? nodeMap.get(ev.entityId) : null;
            return (
              <div
                key={ev.id}
                style={{
                  position: 'relative',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* Dot on timeline */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-31px',
                    top: '20px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--accent-gold)',
                    border: '3px solid var(--bg-abyss)'
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                      {ev.eventType.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(ev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    {ev.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {ev.description}
                  </p>
                </div>

                {linkedNode && (
                  <Link
                    href={`/node/${linkedNode.slug || linkedNode.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      color: 'var(--accent-gold)'
                    }}
                  >
                    <span>View</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
