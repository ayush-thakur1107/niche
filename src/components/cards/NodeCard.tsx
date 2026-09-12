'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Trash2 } from 'lucide-react';
import { NodeItem, UncertaintyLevel, isCreativeWork } from '@/lib/types';
import styles from './NodeCard.module.css';

interface NodeCardProps {
  node: NodeItem;
  isFeatured?: boolean;
  className?: string;
  onDelete?: (nodeId: string) => void;
}

const TYPE_ACCENTS: Record<string, string> = {
  PERSON: '#4d8ee5',
  PLACE: '#5ba37e',
  EVENT: '#e57373',
  ERA: '#d4a373',
  CIVILIZATION: '#d4a373',
  EMPIRE: '#d4a373',
  CONCEPT: '#e2a857',
  IDEA: '#a87be6',
  PHILOSOPHY: '#a87be6',
  THEORY: '#9d7ec7',
  BOOK: '#d4a373',
  MOVIE: '#e06c75',
  SONG: '#61afef',
  ALBUM: '#61afef',
  ARTIST: '#61afef',
  SKILL: '#98c379',
  CRAFT: '#c678dd',
  PROJECT: '#e5c07b',
  WORD: '#56b6c2',
  QUOTE: '#56b6c2'
};

const STATUS_CONFIG: Record<UncertaintyLevel, { label: string; color: string }> = {
  known: { label: 'Known', color: '#d4a359' },
  partially_understood: { label: 'Partially Understood', color: '#7b9ab8' },
  need_research: { label: 'Need Research', color: '#d48b59' },
  confused: { label: 'Confused', color: '#c75a5a' },
  unverified: { label: 'Unverified', color: '#9d7ec7' },
  question: { label: 'Question', color: '#56b6c2' }
};

export function NodeCard({ node, isFeatured = false, className, onDelete }: NodeCardProps) {
  const router = useRouter();
  const [isRemoved, setIsRemoved] = useState(false);

  if (isRemoved) return null;

  const accentColor = TYPE_ACCENTS[node.type] || '#e2a857';
  const statusInfo = STATUS_CONFIG[node.uncertaintyLevel] || {
    label: (node.uncertaintyLevel || '').replace('_', ' '),
    color: '#8e8e9c'
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic instant removal from UI
    setIsRemoved(true);
    if (onDelete) {
      onDelete(node.id);
    }

    try {
      await fetch(`/api/nodes/${node.id}`, { method: 'DELETE' });
      router.refresh();
    } catch (err) {
      console.error('Failed to delete node:', err);
    }
  };

  return (
    <Link
      href={`/node/${node.slug || node.id}`}
      className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''} ${className || ''}`}
      data-node-card="true"
    >
      {/* Left-edge archival type line - sole container cue */}
      <div
        className={styles.typeBar}
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Header: Monospace Eyebrow & Instrument-Panel Level & Delete */}
      <div className={styles.header}>
        <span
          className={styles.eyebrow}
          style={{ color: accentColor }}
        >
          {node.type}
        </span>

        <div className={styles.headerRight}>
          {!isCreativeWork(node.type) && (
            <span className={styles.levelTag}>
              LVL {node.learningState}
            </span>
          )}
          <button
            type="button"
            className={styles.deleteCardBtn}
            onClick={handleDelete}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            title={`Delete "${node.title}"`}
            aria-label={`Delete "${node.title}"`}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Editorial Title */}
      <h3 className={styles.title}>{node.title}</h3>

      {/* Body / Summary */}
      {node.summary && <p className={styles.summary}>{node.summary}</p>}

      {/* Footer: Quiet Status Indicator & Monospace Navigation */}
      <div className={styles.footer}>
        <div className={styles.statusIndicator}>
          <span
            className={styles.statusDot}
            style={{ backgroundColor: statusInfo.color }}
          />
          <span className={styles.statusText}>{statusInfo.label}</span>
        </div>

        <div className={styles.exploreTrigger}>
          <ArrowRight size={12} className={styles.arrowIcon} />
        </div>
      </div>
    </Link>
  );
}
