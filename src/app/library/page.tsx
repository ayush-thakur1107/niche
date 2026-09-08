'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Star, ArrowRight, X, Sparkles, BookMarked } from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import { CardTilt } from '@/interaction/cards/CardTilt';
import { NodeItem } from '@/lib/types';
import styles from './library.module.css';

export default function LibraryPage() {
  const { setCursor, resetCursor } = useInteractionStore();
  const [books, setBooks] = useState<NodeItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<NodeItem | null>(null);

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const bookNodes = data.filter(
            n => n.type === 'BOOK' || n.tags.includes('book') || n.tags.includes('literature')
          );
          setBooks(bookNodes);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Personal Canon & Reading Journal</span>
          </div>
          <h1 className={styles.title}>THE LIBRARY</h1>
          <p className={styles.subtitle}>
            “Books are not passive shelf items; they are cognitive artifacts that alter your mental models.”
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge" style={{ color: 'var(--accent-gold)' }}>
            {books.length} Books in Canon
          </span>
        </div>
      </header>

      {/* Book Grid */}
      <section>
        <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px' }}>
          Physical Shelf Objects · Click Book to Open & Read Marginalia
        </div>

        <div className={styles.bookGrid}>
          {books.map(book => (
            <CardTilt key={book.id} maxTilt={10}>
              <div
                className={styles.bookObject}
                onClick={() => setSelectedBook(book)}
                onMouseEnter={() => setCursor('OPEN')}
                onMouseLeave={() => resetCursor()}
              >
                {book.coverImage && (
                  <div
                    className={styles.bookCover}
                    style={{ backgroundImage: `url(${book.coverImage})` }}
                  >
                    <div className={styles.bookCoverOverlay} />
                  </div>
                )}

                <div>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <div className={styles.bookAuthor}>
                    {book.tags.find(t => t !== 'book' && t !== 'literature') || 'Canon Author'}
                  </div>
                  <p className={styles.bookSummary}>{book.summary}</p>
                  {book.whyCare && (
                    <div className={styles.bookWhyCare}>
                      “{book.whyCare}”
                    </div>
                  )}
                </div>

                <div className={styles.bookFooter}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
                    {book.uncertaintyLevel ? book.uncertaintyLevel.replace('_', ' ') : 'Canon Text'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold)', fontSize: '0.76rem', fontWeight: 600 }}>
                    <span>Open</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </CardTilt>
          ))}
        </div>
      </section>

      {/* Book Inspection Modal (The Book Inside) */}
      {selectedBook && (
        <div className={styles.modalOverlay} onClick={() => setSelectedBook(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge" style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>
                  CANON OBJECT
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--text-primary)', lineHeight: 1.15 }}>
                  {selectedBook.title}
                </h2>
              </div>
              <button onClick={() => setSelectedBook(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {selectedBook.summary}
            </p>

            {selectedBook.whyCare && (
              <div
                style={{
                  background: 'var(--bg-abyss)',
                  border: '1px solid var(--border-focus)',
                  borderLeft: '4px solid var(--accent-gold)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  PERSONAL RESONANCE & MARGINALIA
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                  “{selectedBook.whyCare}”
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {selectedBook.tags.map(t => (
                  <span key={t} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    #{t}
                  </span>
                ))}
              </div>

              <Link
                href={`/node/${selectedBook.slug || selectedBook.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--accent-gold)',
                  color: 'var(--bg-abyss)',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  textDecoration: 'none'
                }}
              >
                <BookMarked size={15} />
                <span>Open Full Node & Connections</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
