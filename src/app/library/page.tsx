'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Star, ArrowRight, X, Sparkles, BookMarked, Plus, Trash2 } from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import { CardTilt } from '@/interaction/cards/CardTilt';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { NodeItem } from '@/lib/types';
import styles from './library.module.css';

export default function LibraryPage() {
  const { setCursor, resetCursor } = useInteractionStore();
  const [books, setBooks] = useState<NodeItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<NodeItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleDeleteBook = async (e: React.MouseEvent, book: NodeItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${book.title}" from library?`)) {
      try {
        const res = await fetch(`/api/nodes/${book.id}`, { method: 'DELETE' });
        if (res.ok) {
          setBooks(prev => prev.filter(b => b.id !== book.id));
          if (selectedBook?.id === book.id) {
            setSelectedBook(null);
          }
        }
      } catch (err) {
        console.error('Failed to delete book:', err);
      }
    }
  };

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge" style={{ color: 'var(--accent-gold)' }}>
            {books.length} Books in Canon
          </span>
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
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            <Plus size={14} />
            <span>Add Book</span>
          </button>
        </div>
      </header>

      {/* Book Grid */}
      <section>
        <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px' }}>
          Physical Shelf Objects · Click Book to Open & Read Marginalia
        </div>

        {books.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            <BookOpen size={28} color="var(--accent-gold)" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
              No books recorded in your canon yet
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              The library is a sanctum for cognitive artifacts that alter your mental models. Log your first foundational text.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                background: 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
                color: '#08080a',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              <Plus size={15} />
              <span>Add Your First Book</span>
            </button>
          </div>
        ) : (
          <div className={styles.bookGrid}>
            {books.map(book => (
              <CardTilt key={book.id} maxTilt={10}>
                <div
                  className={styles.bookObject}
                  onClick={() => setSelectedBook(book)}
                  onMouseEnter={() => setCursor('OPEN')}
                  onMouseLeave={() => resetCursor()}
                >
                  <div className={styles.bookSpine}>
                    <span className={styles.spineText}>{book.title}</span>
                  </div>

                  <div className={styles.bookCover}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div className={styles.bookTag}>
                        {book.tags[0] ? `#${book.tags[0]}` : 'CANON'}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteBook(e, book)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.22)',
                          color: '#f87171',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.22)';
                          e.currentTarget.style.color = '#f87171';
                        }}
                        title={`Delete "${book.title}"`}
                        aria-label={`Delete "${book.title}"`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className={styles.bookTitle}>{book.title}</div>
                    <div className={styles.bookAuthor}>
                      {book.uncertaintyLevel ? book.uncertaintyLevel.replace('_', ' ') : 'Author'}
                    </div>

                    <p className={styles.bookSummary}>
                      {book.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-faint)' }}>
                      <span className={styles.statusBadge}>
                        {book.learningState >= 5 ? 'Mastered' : 'Engaged'}
                      </span>
                      <ArrowRight size={13} color="var(--accent-gold)" />
                    </div>
                  </div>
                </div>
              </CardTilt>
            ))}
          </div>
        )}
      </section>

      {/* Book Reading Drawer / Modal */}
      {selectedBook && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedBook(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="mono-tag" style={{ color: 'var(--accent-gold)', marginBottom: '8px', display: 'inline-block' }}>
                  CANON SPECIMEN
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', margin: '4px 0' }}>
                  {selectedBook.title}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={(e) => handleDeleteBook(e, selectedBook)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={`Delete "${selectedBook.title}" from library`}
                >
                  <Trash2 size={15} />
                </button>
                <button onClick={() => setSelectedBook(null)} className={styles.closeBtn}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '16px 0' }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {selectedBook.tags.map(t => (
                  <span key={t} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    #{t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={(e) => handleDeleteBook(e, selectedBook)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.28)',
                    color: '#f87171',
                    padding: '9px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={`Delete "${selectedBook.title}"`}
                >
                  <Trash2 size={14} />
                  <span>Delete Book</span>
                </button>

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
        </div>
      )}

      {/* Add Book Modal */}
      <CreateNodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="BOOK"
        defaultTags={['book', 'literature']}
        onNodeCreated={(newBook) => {
          setBooks(prev => [newBook, ...prev]);
        }}
      />
    </div>
  );
}
