'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Star, Play, ArrowRight, Eye, Calendar, Sparkles } from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import { CardTilt } from '@/interaction/cards/CardTilt';
import { NodeItem } from '@/lib/types';
import styles from './cinema.module.css';

export default function CinemaPage() {
  const { setCursor, resetCursor } = useInteractionStore();
  const [movies, setMovies] = useState<NodeItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FAVORITES' | 'WATCHLIST'>('ALL');

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filmNodes = data.filter(
            n => n.type === 'MOVIE' || n.tags.includes('cinema') || n.tags.includes('movie')
          );
          setMovies(filmNodes);
        }
      })
      .catch(() => {});
  }, []);

  const heroMovie = movies.find(m => m.slug === 'blade-runner-2049') || movies[0];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Film size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Art-Directed Film Archive</span>
          </div>
          <h1 className={styles.title}>CINEMATHEQUE</h1>
          <p className={styles.subtitle}>
            “Film not as casual distraction, but as visual philosophy, memory, and personal resonance.”
          </p>
        </div>

        <div className={styles.categoryFilters}>
          {(['ALL', 'FAVORITES', 'WATCHLIST'] as const).map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Cinematic Hero Feature (Section 14) */}
      {heroMovie && (
        <section
          className={styles.heroFeature}
          onMouseEnter={() => setCursor('WATCH')}
          onMouseLeave={() => resetCursor()}
        >
          <div
            className={styles.heroBackdrop}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(7,7,9,1) 0%, rgba(7,7,9,0.4) 60%, rgba(7,7,9,0.8) 100%), url(${heroMovie.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80'})`
            }}
          />

          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Sparkles size={13} color="var(--accent-gold)" />
              <span>FEATURED MASTERWORK</span>
            </div>

            <h2 className={styles.heroTitle}>{heroMovie.title}</h2>
            <p className={styles.heroSummary}>{heroMovie.summary}</p>

            {heroMovie.whyCare && (
              <div className={styles.heroQuote}>
                “{heroMovie.whyCare}”
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '16px' }}>
              <Link
                href={`/node/${heroMovie.slug || heroMovie.id}`}
                className={styles.heroExploreBtn}
              >
                <Play size={14} fill="currentColor" />
                <span>Open Film Record</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Movie Grid with CardTilt and WATCH Cursor */}
      <section>
        <div className={styles.sectionTitle}>
          <span>Canon Collection ({movies.length})</span>
        </div>

        <div className={styles.movieGrid}>
          {movies.map(m => (
            <CardTilt key={m.id} maxTilt={12}>
              <Link
                href={`/node/${m.slug || m.id}`}
                className={styles.posterCard}
                onMouseEnter={() => setCursor('WATCH')}
                onMouseLeave={() => resetCursor()}
              >
                <div
                  className={styles.posterImage}
                  style={{
                    backgroundImage: `url(${m.coverImage || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'})`
                  }}
                >
                  <div className={styles.posterOverlay}>
                    <span className={styles.watchBadge}>WATCH</span>
                  </div>
                </div>

                <div className={styles.posterMeta}>
                  <div className={styles.posterTitle}>{m.title}</div>
                  <p className={styles.posterDesc}>{m.summary}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-faint)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
                      {m.uncertaintyLevel ? m.uncertaintyLevel.replace('_', ' ') : 'Film Canon'}
                    </span>
                    <ArrowRight size={13} color="var(--accent-gold)" />
                  </div>
                </div>
              </Link>
            </CardTilt>
          ))}
        </div>
      </section>
    </div>
  );
}
