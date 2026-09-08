import React from 'react';
import Link from 'next/link';
import {
  Map,
  ArrowRight,
  Compass,
  Sparkles,
  BookOpen,
  Share2
} from 'lucide-react';
import { getAllNodes, getAllConnections, getUniverseStats } from '@/lib/storage';
import { StatsLedger } from '@/components/dashboard/StatsLedger';
import { StaggeredNodesGrid } from '@/components/dashboard/StaggeredNodesGrid';
import styles from './page.module.css';

export const revalidate = 0; // Dynamic server-side rendering

export default async function HomePage() {
  const nodes = getAllNodes();
  const connections = getAllConnections();
  const stats = getUniverseStats();

  // Highlighted specimen for "From the Archive"
  const camusNode = nodes.find(n => n.title.toLowerCase().includes('camus')) || null;
  const spotlightNode = camusNode || (nodes.length > 0 ? nodes[Math.floor(Math.random() * nodes.length)] : null);

  // Dynamic focus items derived from real nodes
  const readingNode = nodes.find(n => n.type === 'BOOK' || n.tags.includes('reading') || n.tags.includes('book'));
  const learningNode = nodes.find(n => n.learningState >= 1 && n.learningState <= 4 && n !== readingNode);
  const buildingNode = nodes.find(n => n.type === 'PROJECT' || n.tags.includes('building') || n.tags.includes('project'));
  const trainingNode = nodes.find(n => n.type === 'SPORT' || n.tags.includes('fitness') || n.tags.includes('training'));
  const thinkingNode = nodes.find(n => n.type === 'PHILOSOPHY' || n.type === 'IDEA' || n.type === 'THEORY' || n.tags.includes('philosophy'));
  const craftNode = nodes.find(n => n.type === 'CRAFT' || n.type === 'ARCHITECTURE' || n.tags.includes('craft'));

  const candidateItems = [
    readingNode && { category: 'Reading', title: readingNode.title, desc: readingNode.summary || readingNode.type, href: `/node/${readingNode.slug || readingNode.id}` },
    learningNode && { category: 'Learning', title: learningNode.title, desc: learningNode.summary || `Level ${learningNode.learningState}`, href: `/node/${learningNode.slug || learningNode.id}` },
    buildingNode && { category: 'Building', title: buildingNode.title, desc: buildingNode.summary || buildingNode.type, href: `/node/${buildingNode.slug || buildingNode.id}` },
    trainingNode && { category: 'Training', title: trainingNode.title, desc: trainingNode.summary || trainingNode.type, href: `/node/${trainingNode.slug || trainingNode.id}` },
    thinkingNode && { category: 'Thinking', title: thinkingNode.title, desc: thinkingNode.summary || thinkingNode.type, href: `/node/${thinkingNode.slug || thinkingNode.id}` },
    craftNode && { category: 'Subtle Craft', title: craftNode.title, desc: craftNode.summary || craftNode.type, href: `/node/${craftNode.slug || craftNode.id}` },
  ].filter(Boolean) as { category: string; title: string; desc: string; href: string }[];

  const focusItems = candidateItems.length > 0
    ? candidateItems
    : nodes.slice(0, 6).map((n) => ({
        category: n.type || 'Focus',
        title: n.title,
        desc: n.summary || `Level ${n.learningState || 1}`,
        href: `/node/${n.slug || n.id}`
      }));

  return (
    <div className={styles.container}>
      {/* 1. Hero Section (Thinking Machines Scale × Railway Precision) */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeadline}>AYUSH THAKUR</h1>
          <p className={styles.heroSubline}>
            “A map of things I know, want to know, make, love, question, and become.”
          </p>
        </div>

        {/* Disconnected CTA: anchored to lower-right on its own grid position */}
        <div className={styles.heroCtaRow}>
          <Link href="/atlas" className={styles.enterAtlasBtn}>
            <Map size={14} />
            <span>Enter Atlas Universe</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 2. Currently in Focus (Dynamic from nodes) */}
      <section>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Compass size={13} color="var(--accent-gold)" />
            <span>01 // Currently in Focus</span>
          </div>
        </div>

        {focusItems.length > 0 ? (
          <div className={styles.currentlyGrid}>
            {focusItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={styles.currentlyCard}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className={styles.currentlyLabel}>{item.category}</span>
                <div className={styles.currentlyValue}>{item.title}</div>
                <div className={styles.currentlyDesc}>{item.desc}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '36px 24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(14, 15, 22, 0.4)',
              textAlign: 'center',
              color: '#8e8e9c',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ color: 'var(--accent-gold)', marginBottom: '6px' }}>// NO ACTIVE NODES IN FOCUS</div>
            <div>Your universe is cleared. Add entities on the Atlas canvas to track active focus streams.</div>
          </div>
        )}
      </section>

      {/* 3. From The Archive / Live Signal Interruption */}
      {spotlightNode && (
        <section className={styles.spotlightCard}>
          <div>
            <div className={styles.spotlightMeta}>
              <Sparkles size={13} />
              <span>Specimen // Resurfaced · Curiosity Archive</span>
            </div>
            <div className={styles.spotlightTitle}>{spotlightNode.title}</div>
            <p className={styles.spotlightDesc}>
              {spotlightNode.summary || spotlightNode.whyCare || 'An entity from your personal intellectual atlas.'}
            </p>
          </div>

          <Link
            href={`/node/${spotlightNode.slug || spotlightNode.id}`}
            className={styles.spotlightBtn}
          >
            <span>Explore Specimen</span>
            <ArrowRight size={13} />
          </Link>
        </section>
      )}

      {/* 4. Entities & Discoveries */}
      <section>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <BookOpen size={13} color="var(--accent-gold)" />
            <span>02 // Entities & Discoveries in Your Universe</span>
          </div>

          <Link href="/atlas" className={styles.sectionActionLink}>
            Canvas Graph View →
          </Link>
        </div>

        <StaggeredNodesGrid nodes={nodes.slice(0, 7)} />
      </section>

      {/* 5. Universe Metrics */}
      <section>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Share2 size={13} color="var(--accent-gold)" />
            <span>03 // Universe Telemetry & Registry</span>
          </div>
        </div>

        <StatsLedger
          totalNodes={stats.totalNodes}
          totalConnections={stats.totalConnections}
          distinctDisciplines={Object.keys(stats.typeCounts).length}
          totalSources={stats.totalSources}
        />
      </section>
    </div>
  );
}
