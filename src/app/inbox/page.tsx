'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inbox, Plus, Check, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { InboxItem } from '@/lib/types';
import styles from '../page.module.css';

export default function InboxPage() {
  const router = useRouter();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('thought');
  const [loading, setLoading] = useState(true);

  const loadInbox = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inbox');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent.trim(), category: newCategory })
      });
      setNewContent('');
      loadInbox();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertToNode = async (item: InboxItem) => {
    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.content.length > 50 ? item.content.substring(0, 47) + '...' : item.content,
          type: item.category === 'question' ? 'CONCEPT' : 'IDEA',
          whyCare: item.content,
          learningState: 1
        })
      });
      const node = await res.json();

      // Mark inbox item as processed
      await fetch('/api/inbox', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: 'processed' })
      });

      router.push(`/node/${node.slug || node.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/inbox?id=${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Inbox size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Fragment Processing Queue</span>
          </div>
          <h1 className={styles.heroHeadline}>INBOX</h1>
          <p className={styles.heroSubline}>
            “Anything uncertain goes here. Later: convert to node, attach to an existing node, or dismiss.”
          </p>
        </div>
      </header>

      {/* Quick capture form inside page */}
      <form
        onSubmit={handleCreate}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px 20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <input
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Capture an unsorted thought, question, or quote... (or press N anywhere)"
          style={{ flex: 1, background: 'var(--bg-abyss)' }}
        />

        <select
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          style={{ background: 'var(--bg-surface-raised)' }}
        >
          <option value="thought">Thought</option>
          <option value="research">Research Lead</option>
          <option value="question">Question</option>
          <option value="quote">Quote</option>
        </select>

        <button
          type="submit"
          disabled={!newContent.trim()}
          style={{
            background: 'var(--accent-gold)',
            color: 'var(--bg-abyss)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.84rem'
          }}
        >
          Capture
        </button>
      </form>

      {/* Inbox items list */}
      <section>
        <div className={styles.sectionTitle}>Pending Fragments ({items.length})</div>

        {items.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '36px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              Inbox is clean.
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
              Whenever curiosity strikes, hit <span className="kbdTag">N</span> to capture fleeting thoughts before they dissipate.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge" style={{ color: 'var(--accent-gold)' }}>{item.category}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {item.content}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleConvertToNode(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'var(--accent-gold-bg)',
                      border: '1px solid var(--border-focus)',
                      color: 'var(--accent-gold)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.78rem',
                      fontWeight: 550
                    }}
                    title="Promote into an Atlas node"
                  >
                    <Sparkles size={13} />
                    <span>Convert to Node</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ color: 'var(--text-faint)', padding: '6px' }}
                    title="Dismiss"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
