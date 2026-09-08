'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Share2 } from 'lucide-react';
import { NodeItem, NodeType, isCreativeWork } from '@/lib/types';
import styles from './CustomNode.module.css';

const TYPE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  PERSON: { color: '#61afef', bg: 'rgba(97, 175, 239, 0.12)', border: 'rgba(97, 175, 239, 0.4)' },
  EMPIRE: { color: '#e5c07b', bg: 'rgba(229, 192, 123, 0.12)', border: 'rgba(229, 192, 123, 0.4)' },
  CIVILIZATION: { color: '#d19a66', bg: 'rgba(209, 154, 102, 0.12)', border: 'rgba(209, 154, 102, 0.4)' },
  CONCEPT: { color: '#e2a857', bg: 'rgba(226, 168, 87, 0.12)', border: 'rgba(226, 168, 87, 0.4)' },
  PHILOSOPHY: { color: '#c678dd', bg: 'rgba(198, 120, 221, 0.12)', border: 'rgba(198, 120, 221, 0.4)' },
  BOOK: { color: '#d4a373', bg: 'rgba(212, 163, 115, 0.12)', border: 'rgba(212, 163, 115, 0.4)' },
  MOVIE: { color: '#e06c75', bg: 'rgba(224, 108, 117, 0.12)', border: 'rgba(224, 108, 117, 0.4)' },
  SPORT: { color: '#98c379', bg: 'rgba(152, 195, 121, 0.12)', border: 'rgba(152, 195, 121, 0.4)' },
  CRAFT: { color: '#c678dd', bg: 'rgba(198, 120, 221, 0.12)', border: 'rgba(198, 120, 221, 0.4)' },
  ARCHITECTURE: { color: '#abb2bf', bg: 'rgba(171, 178, 191, 0.12)', border: 'rgba(171, 178, 191, 0.4)' },
  WORD: { color: '#56b6c2', bg: 'rgba(86, 182, 194, 0.12)', border: 'rgba(86, 182, 194, 0.4)' },
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const node = data as unknown as NodeItem & { connectionCount?: number };
  const typeStyle = TYPE_COLORS[node.type] || {
    color: '#e2a857',
    bg: 'rgba(226, 168, 87, 0.12)',
    border: 'rgba(226, 168, 87, 0.4)'
  };

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.nodeCardSelected : ''}`}>
      {/* Top connect handle */}
      <Handle
        type="target"
        position={Position.Top}
        className={styles.customHandle}
        id="top"
      />

      <div className={styles.typeHeader}>
        <span
          className={styles.typeBadge}
          style={{
            color: typeStyle.color,
            backgroundColor: typeStyle.bg,
            borderColor: typeStyle.border
          }}
        >
          {node.type}
        </span>

        {!isCreativeWork(node.type) && (
          <span className={styles.learningStateBadge} title={`Learning state: Level ${node.learningState}`}>
            Lvl {node.learningState}
          </span>
        )}
      </div>

      <div className={styles.title}>{node.title}</div>

      {node.summary && (
        <div className={styles.summary}>{node.summary}</div>
      )}

      <div className={styles.footer}>
        <div className={styles.tagList}>
          {node.tags && node.tags.slice(0, 2).map(tag => (
            <span key={tag} className={styles.tagPill}>#{tag}</span>
          ))}
        </div>

        {node.connectionCount !== undefined && node.connectionCount > 0 && (
          <div className={styles.connectionCount}>
            <Share2 size={11} />
            <span>{node.connectionCount}</span>
          </div>
        )}
      </div>

      {/* Bottom connect handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.customHandle}
        id="bottom"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
