'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Inbox, Sparkles } from 'lucide-react';
import styles from './CommandPalette.module.css';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptured?: (item: any) => void;
}

export function QuickCaptureModal({ isOpen, onClose, onCaptured }: QuickCaptureModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('thought');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setContent('');
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), category })
      });
      const data = await res.json();
      if (onCaptured) onCaptured(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
            <Inbox size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.04em' }}>QUICK CAPTURE</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Capture an idea, question, book quote, or curiosity fragment into your Inbox before it vanishes.
          </p>

          <textarea
            ref={textareaRef}
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="e.g. Need to understand how monsoon winds dictated Chola naval campaigns..."
            style={{
              width: '100%',
              background: 'var(--bg-abyss)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              resize: 'none'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '4px 8px',
                fontSize: '0.78rem'
              }}
            >
              <option value="thought">Thought</option>
              <option value="research">Research Lead</option>
              <option value="question">Question</option>
              <option value="quote">Quote</option>
              <option value="movie_or_book">Book / Film to Check</option>
            </select>

            <button
              type="submit"
              disabled={!content.trim() || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--accent-gold)',
                color: 'var(--bg-abyss)',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.82rem',
                opacity: !content.trim() || loading ? 0.5 : 1
              }}
            >
              <Send size={13} />
              <span>Capture (⌘↵)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
