'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Globe, Sparkles } from 'lucide-react';
import { NodeType, LearningState, LEARNING_STATE_LABELS, isCreativeWork } from '@/lib/types';
import styles from '../navigation/CommandPalette.module.css';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeCreated?: (node: any) => void;
}

const NODE_TYPES: NodeType[] = [
  'CONCEPT',
  'PERSON',
  'EMPIRE',
  'CIVILIZATION',
  'EVENT',
  'ERA',
  'PLACE',
  'BOOK',
  'MOVIE',
  'SONG',
  'ALBUM',
  'ARTIST',
  'PHILOSOPHY',
  'IDEA',
  'THEORY',
  'SKILL',
  'PROJECT',
  'CRAFT',
  'ARCHITECTURE',
  'WORD',
  'CUSTOM'
];

export function CreateNodeModal({ isOpen, onClose, onNodeCreated }: CreateNodeModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NodeType>('CONCEPT');
  const [summary, setSummary] = useState('');
  const [whyCare, setWhyCare] = useState('');
  const [learningState, setLearningState] = useState<LearningState>(2);
  const [tagsInput, setTagsInput] = useState('');
  const [fetchWikipedia, setFetchWikipedia] = useState(true);
  const [loading, setLoading] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSummary('');
      setWhyCare('');
      setTagsInput('');
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      // 1. Create node
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          type,
          summary: summary.trim(),
          whyCare: whyCare.trim(),
          learningState: Number(learningState),
          tags
        })
      });
      const node = await res.json();

      // 2. If user requested Wikipedia context fetch, trigger it
      if (fetchWikipedia && node && node.id) {
        try {
          await fetch('/api/providers/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: title.trim(),
              provider: 'wikipedia',
              nodeId: node.id
            })
          });
        } catch (fetchErr) {
          console.error('Wikipedia fetch error:', fetchErr);
        }
      }

      if (onNodeCreated) {
        onNodeCreated(node);
      }
      onClose();
      router.push(`/node/${node.slug || node.id}`);
    } catch (err) {
      console.error('Node creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
            <Plus size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.04em' }}>CREATE UNIVERSE NODE</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              NODE TITLE / ENTITY NAME *
            </label>
            <input
              ref={titleInputRef}
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Chola Dynasty, Aryabhata, Absurdism, Brutalism..."
              style={{ width: '100%', fontSize: '1.05rem', fontWeight: 500 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isCreativeWork(type) ? '1fr' : '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                TYPE
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as NodeType)}
                style={{ width: '100%' }}
              >
                {NODE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {!isCreativeWork(type) && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  LEARNING STATE (0–7)
                </label>
                <select
                  value={learningState}
                  onChange={e => setLearningState(Number(e.target.value) as LearningState)}
                  style={{ width: '100%' }}
                >
                  {Object.entries(LEARNING_STATE_LABELS).map(([lvl, label]) => (
                    <option key={lvl} value={lvl}>{lvl} — {label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              SHORT SUMMARY / ESSENCE
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="A concise definition or summary of this concept or entity..."
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', marginBottom: '4px' }}>
              WHY DO I CARE ABOUT THIS? (PERSONAL INTENT)
            </label>
            <textarea
              rows={2}
              value={whyCare}
              onChange={e => setWhyCare(e.target.value)}
              placeholder="Why this matters to me, how I discovered it, or what question it provokes..."
              style={{ width: '100%', resize: 'none', borderColor: 'var(--border-focus)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              TAGS (COMMA SEPARATED)
            </label>
            <input
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="history, physics, literature, deep, unfinished"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
            <input
              type="checkbox"
              id="wiki-fetch"
              checked={fetchWikipedia}
              onChange={e => setFetchWikipedia(e.target.checked)}
              style={{ width: 'auto', accentColor: 'var(--accent-gold)' }}
            />
            <label htmlFor="wiki-fetch" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} color="var(--accent-gold)" />
              <span>Automatically query Wikipedia & attach external context & source citation</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                color: 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--accent-gold)',
                color: 'var(--bg-abyss)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                opacity: !title.trim() || loading ? 0.5 : 1
              }}
            >
              <Sparkles size={14} />
              <span>{loading ? 'Manifesting...' : 'Create Node & Open'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
