import React from 'react';
import Link from 'next/link';
import {
  Map,
  ArrowRight,
  Compass,
  Sparkles,
  BookOpen,
  Share2,
  Dumbbell,
  Lightbulb,
  Milestone
} from 'lucide-react';
import { getAllNodes, getAllConnections, getUniverseStats } from '@/lib/storage';
import styles from './page.module.css';

export const revalidate = 0; // Dynamic server-side rendering

export default async function HomePage() {
  const nodes = getAllNodes();
  const connections = getAllConnections();
  const stats = getUniverseStats();

  // Random node spotlight for "From the Archive"
  const randomNode = nodes.length > 0 ? nodes[Math.floor(Math.random() * nodes.length)] : null;

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div>
          <h1 className={styles.heroHeadline}>NICHE MAXING</h1>
          <p className={styles.heroSubline}>
            “A map of things I know, want to know, make, love, question, and become.”
          </p>
        </div>

        <Link href="/atlas" className={styles.enterAtlasBtn}>
          <Map size={18} />
          <span>Enter The Atlas Universe</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Currently Section (Section 30 of Brief) */}
      <section>
        <div className={styles.sectionTitle}>
          <Compass size={14} color="var(--accent-gold)" />
          <span>Currently in Focus</span>
        </div>

        <div className={styles.currentlyGrid}>
          <div className={styles.currentlyCard}>
            <span className={styles.currentlyLabel}>Reading</span>
            <div className={styles.currentlyValue}>The Stranger</div>
            <div className={styles.currentlyDesc}>Camus · French Absurdist Novella</div>
          </div>

          <div className={styles.currentlyCard}>
            <span className={styles.currentlyLabel}>Learning</span>
            <div className={styles.currentlyValue}>Chola Naval Thalassocracy</div>
            <div className={styles.currentlyDesc}>Indian Ocean monsoon trade routes</div>
          </div>

          <div className={styles.currentlyCard}>
            <span className={styles.currentlyLabel}>Building</span>
            <div className={styles.currentlyValue}>Niche Maxing System</div>
            <div className={styles.currentlyDesc}>Personal digital life universe</div>
          </div>

          <div className={styles.currentlyCard}>
            <span className={styles.currentlyLabel}>Training</span>
            <div className={styles.currentlyValue}>Hammer Curls & Muay Thai</div>
            <div className={styles.currentlyDesc}>17.5 kg strict sets · Teep & elbows</div>
          </div>

          <div className={styles.currentlyCard}>
            <span className={styles.currentlyLabel}>Thinking</span>
            <div className={styles.currentlyValue}>The Myth of Sisyphus</div>
            <div className={styles.currentlyDesc}>Defiance in an indifferent cosmos</div>
          </div>

          <div className={styles.currentlyCard}>
            <span className={styles.currentlyLabel}>Subtle Craft</span>
            <div className={styles.currentlyValue}>Bespoke Tailoring</div>
            <div className={styles.currentlyDesc}>Floating canvas chest balance</div>
          </div>
        </div>
      </section>

      {/* From The Archive / Spotlight (Section 29) */}
      {randomNode && (
        <section className={styles.spotlightCard}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={14} color="var(--accent-gold)" />
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                From The Archive · Curiosity Resurface
              </span>
            </div>
            <div className={styles.spotlightTitle}>{randomNode.title}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', maxWidth: '650px' }}>
              {randomNode.summary || randomNode.whyCare || 'An entity from your personal intellectual atlas.'}
            </p>
          </div>

          <Link
            href={`/node/${randomNode.slug || randomNode.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              background: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-muted)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Explore Node</span>
            <ArrowRight size={14} />
          </Link>
        </section>
      )}

      {/* Recent Discoveries */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className={styles.sectionTitle} style={{ margin: 0 }}>
            <BookOpen size={14} color="var(--accent-gold)" />
            <span>Entities & Discoveries in Your Universe</span>
          </div>

          <Link href="/atlas" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
            View all on canvas →
          </Link>
        </div>

        <div className={styles.nodesGrid}>
          {nodes.slice(0, 8).map(node => (
            <Link
              key={node.id}
              href={`/node/${node.slug || node.id}`}
              className={styles.nodeCard}
            >
              <div className={styles.nodeHeader}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-gold)',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}
                >
                  {node.type}
                </span>

                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Lvl {node.learningState}
                </span>
              </div>

              <div className={styles.nodeTitle}>{node.title}</div>
              {node.summary && <div className={styles.nodeSummary}>{node.summary}</div>}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-faint)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                  {node.uncertaintyLevel.replace('_', ' ')}
                </span>
                <ArrowRight size={13} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Universe Metrics (Section 58, 85) */}
      <section>
        <div className={styles.sectionTitle}>
          <Share2 size={14} color="var(--accent-gold)" />
          <span>Your World At A Glance</span>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <div className={styles.statNumber}>{stats.totalNodes}</div>
            <div className={styles.statLabel}>Total Universe Nodes</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statNumber}>{stats.totalConnections}</div>
            <div className={styles.statLabel}>Established Connections</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statNumber}>{Object.keys(stats.typeCounts).length}</div>
            <div className={styles.statLabel}>Distinct Disciplines</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statNumber}>{stats.totalSources}</div>
            <div className={styles.statLabel}>Verified Citations</div>
          </div>
        </div>
      </section>
    </div>
  );
}
