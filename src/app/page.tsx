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

  // Highlighted specimen for "From the Archive" (default to Albert Camus if present, or random node)
  const camusNode = nodes.find(n => n.title.toLowerCase().includes('camus')) || null;
  const spotlightNode = camusNode || (nodes.length > 0 ? nodes[Math.floor(Math.random() * nodes.length)] : null);

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

      {/* 2. Currently in Focus (Containerless Index Entries) */}
      <section>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Compass size={13} color="var(--accent-gold)" />
            <span>01 // Currently in Focus</span>
          </div>
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
