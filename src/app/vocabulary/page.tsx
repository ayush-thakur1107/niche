'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookA, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { NodeCard } from '@/components/cards/NodeCard';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { NodeItem } from '@/lib/types';
import styles from '../page.module.css';

export default function VocabularyPage() {
  const [vocabNodes, setVocabNodes] = useState<NodeItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const words = data.filter(
            n => n.type === 'WORD' || n.tags.includes('vocabulary') || n.tags.includes('word')
          );
          setVocabNodes(words);
        }
      })
      .catch(() => {});
  }, []);

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
      <header className={styles.hero} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
          <span>Add Word</span>
        </button>
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
        <div className={styles.sectionTitle}>Adopted Words in Universe ({vocabNodes.length})</div>
        {vocabNodes.length === 0 ? (
          <div
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            <BookA size={24} color="var(--accent-gold)" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', marginBottom: '4px' }}>
              No custom lexicon words adopted yet
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', maxWidth: '380px', margin: '0 auto 16px auto' }}>
              Adopt words into your personal lexicon that grant greater precision to your thinking.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
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
              <span>Add Your First Word</span>
            </button>
          </div>
        ) : (
          <div className={styles.nodesGrid}>
            {vocabNodes.map(node => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </section>

      {/* Add Word Modal */}
      <CreateNodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="WORD"
        defaultTags={['vocabulary', 'word', 'lexicon']}
        onNodeCreated={(newWord) => {
          setVocabNodes(prev => [newWord, ...prev]);
        }}
      />
    </div>
  );
}
