import React from 'react';
import Link from 'next/link';
import { BookOpen, Star, Plus, ArrowRight } from 'lucide-react';
import { getAllNodes } from '@/lib/storage';
import styles from '../page.module.css';

export default function LibraryPage() {
  const allNodes = getAllNodes();
  const bookNodes = allNodes.filter(n => n.type === 'BOOK' || n.tags.includes('book') || n.tags.includes('literature'));

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Personal Library & Reading Journal</span>
          </div>
          <h1 className={styles.heroHeadline}>THE LIBRARY</h1>
          <p className={styles.heroSubline}>
            “Books are not passive shelves; they are nodes that alter how you see the world.”
          </p>
        </div>
      </header>

      {/* Sections: Reading, Read, Want to Read */}
      <section>
        <div className={styles.sectionTitle}>Currently Reading & Core Canon</div>
        <div className={styles.nodesGrid}>
          {bookNodes.map(book => (
            <Link key={book.id} href={`/node/${book.slug || book.id}`} className={styles.nodeCard}>
              <div className={styles.nodeHeader}>
                <span className="badge" style={{ color: '#d4a373', borderColor: 'rgba(212,163,115,0.4)' }}>BOOK</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Lvl {book.learningState}
                </span>
              </div>
              <div className={styles.nodeTitle}>{book.title}</div>
              <p className={styles.nodeSummary}>{book.summary}</p>
              {book.whyCare && (
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontStyle: 'italic', marginTop: '6px' }}>
                  “{book.whyCare}”
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                  {book.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
                </span>
                <ArrowRight size={13} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
