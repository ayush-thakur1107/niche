import React from 'react';
import Link from 'next/link';
import { BookA, Sparkles, ArrowRight } from 'lucide-react';
import { getAllNodes } from '@/lib/storage';
import styles from '../page.module.css';

export default function VocabularyPage() {
  const allNodes = getAllNodes();
  const vocabNodes = allNodes.filter(n => n.type === 'WORD' || n.tags.includes('vocabulary') || n.tags.includes('word'));

  const dailyWord = {
    word: 'Palimpsest',
    pronunciation: '/ˈpalɪm(p)sɛst/',
    etymology: 'From Greek palimpsēstos (palin "again" + psēn "to scrape")',
    definition: 'A manuscript or surface on which earlier writing has been effaced to make room for later writing, yet traces of the original remain visible.',
    mySentence: 'The city’s brick alleyways were a palimpsest of medieval stone, Victorian plaster, and modernist neon.',
    whyCare: 'The quintessential metaphor for how human memory layers over itself without ever truly wiping clean the past.'
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookA size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Personal Vocabulary Lexicon</span>
          </div>
          <h1 className={styles.heroHeadline}>VOCABULARY</h1>
          <p className={styles.heroSubline}>
            “Words I have adopted into my mind, not for academic display, but for precision of thought.”
          </p>
        </div>
      </header>

      {/* Featured Word of the Day */}
      <section className={styles.spotlightCard}>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
              Word In Focus
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {dailyWord.pronunciation}
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {dailyWord.word}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px' }}>
            {dailyWord.etymology}
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
            {dailyWord.definition}
          </p>

          <div style={{ background: 'var(--bg-abyss)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              MY OWN USAGE & RESONANCE
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--accent-gold)', fontStyle: 'italic' }}>
              “{dailyWord.mySentence}”
            </div>
          </div>
        </div>
      </section>

      {/* Adopted Words List */}
      <section>
        <div className={styles.sectionTitle}>Adopted Words in Universe</div>
        <div className={styles.nodesGrid}>
          {vocabNodes.map(node => (
            <Link key={node.id} href={`/node/${node.slug || node.id}`} className={styles.nodeCard}>
              <div className={styles.nodeHeader}>
                <span className="badge" style={{ color: '#56b6c2', borderColor: 'rgba(86,182,194,0.4)' }}>WORD</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lvl {node.learningState}</span>
              </div>
              <div className={styles.nodeTitle}>{node.title}</div>
              <p className={styles.nodeSummary}>{node.summary}</p>
              {node.whyCare && (
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontStyle: 'italic', marginTop: '6px' }}>
                  “{node.whyCare}”
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
