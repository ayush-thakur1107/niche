'use client';

import React from 'react';
import Link from 'next/link';
import { X, ExternalLink, ArrowRight, Trash2, BookOpen, Compass } from 'lucide-react';
import { NodeItem, ConnectionItem, LEARNING_STATE_LABELS, isCreativeWork } from '@/lib/types';
import styles from './InspectorDrawer.module.css';

interface InspectorDrawerProps {
  node: (NodeItem & { connections?: ConnectionItem[] }) | null;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
}

export function InspectorDrawer({
  node,
  onClose,
  onSelectNode,
  onDeleteNode
}: InspectorDrawerProps) {
  if (!node) return null;

  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                fontWeight: 600
              }}
            >
              {node.type}
            </span>
            {!isCreativeWork(node.type) && (
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Lvl {node.learningState} · {LEARNING_STATE_LABELS[node.learningState]}
              </span>
            )}
          </div>
          <div className={styles.title}>{node.title}</div>
        </div>

        <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.body}>
        {node.summary && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Essence</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{node.summary}</p>
          </div>
        )}

        {node.whyCare && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Why I Care (Personal Intent)</div>
            <div className={styles.whyCareBox}>
              “{node.whyCare}”
            </div>
          </div>
        )}

        {node.curiosityTrail && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Curiosity Trail</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {node.curiosityTrail}
            </div>
          </div>
        )}

        {node.tags && node.tags.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {node.tags.map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-muted)'
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Link
          href={`/node/${node.slug || node.id}`}
          className={styles.openPageBtn}
        >
          <BookOpen size={15} />
          <span>Open Full Node Page</span>
        </Link>

        {onDeleteNode && (
          <button
            className={styles.deleteBtn}
            onClick={() => {
              if (confirm(`Delete "${node.title}" from universe?`)) {
                onDeleteNode(node.id);
                onClose();
              }
            }}
            title="Delete Node"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
