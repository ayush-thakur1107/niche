'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Calendar, ArrowRight, Plus, X, Sparkles } from 'lucide-react';
import { TimelineEvent } from '@/lib/types';
import styles from '../page.module.css';

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('milestone');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          date: date || new Date().toISOString().split('T')[0],
          description: description.trim(),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        const newEv = await res.json();
        setEvents(prev => [newEv, ...prev]);
        setIsAddModalOpen(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error('Failed to create timeline event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <History size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Personal Intellectual Chronology</span>
          </div>
          <h1 className={styles.heroHeadline}>TIMELINE</h1>
          <p className={styles.heroSubline}>
            “The evolution of understanding across time: when things were discovered, questioned, or mastered.”
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
          <span>Add Milestone</span>
        </button>
      </header>

      <section>
        <div className={styles.sectionTitle}>Event Log & Discoveries ({events.length})</div>

        {events.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            <History size={26} color="var(--accent-gold)" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
              No chronological events logged yet
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 18px auto' }}>
              Record key life discoveries, shifts in worldview, readings, and physical or creative milestones.
            </p>
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
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Record First Milestone</span>
            </button>
          </div>
        ) : (
          <div style={{ position: 'relative', borderLeft: '2px solid var(--border-subtle)', marginLeft: '16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {events.map(ev => (
              <div
                key={ev.id}
                style={{
                  position: 'relative',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* Dot on timeline */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-31px',
                    top: '20px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--accent-gold)',
                    border: '3px solid var(--bg-abyss)'
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                      {ev.tags && ev.tags[0] ? ev.tags[0] : 'MILESTONE'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {ev.date || new Date(ev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    {ev.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {ev.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Milestone Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 4, 6, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#0d0d12',
              border: '1px solid rgba(226, 168, 87, 0.25)',
              borderRadius: '12px',
              padding: '24px',
              color: '#fff',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} color="var(--accent-gold)" />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
                  Record Timeline Milestone
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#888899', marginBottom: '4px' }}>
                  EVENT TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Discovered Camus & Myth of Sisyphus..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#08080a',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#888899', marginBottom: '4px' }}>
                    DATE
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: '#08080a',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#888899', marginBottom: '4px' }}>
                    TAG / CATEGORY
                  </label>
                  <input
                    type="text"
                    placeholder="reading, philosophy, travel..."
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: '#08080a',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#888899', marginBottom: '4px' }}>
                  DESCRIPTION & SIGNIFICANCE
                </label>
                <textarea
                  rows={3}
                  placeholder="How did this event mark an inflection point or shift in understanding?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#08080a',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.86rem',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#888899',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || isSubmitting}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#08080a',
                    fontWeight: 650,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
