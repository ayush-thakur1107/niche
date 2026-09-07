'use client';

import React, { useState } from 'react';
import { Link2, X, ArrowRight } from 'lucide-react';
import { RelationshipType } from '@/lib/types';
import styles from '../navigation/CommandPalette.module.css';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceNode: { id: string; title: string } | null;
  targetNode: { id: string; title: string } | null;
  onConnected?: (conn: any) => void;
}

const RELATIONSHIP_TYPES: RelationshipType[] = [
  'related_to',
  'influenced',
  'inspired',
  'preceded',
  'followed',
  'caused',
  'part_of',
  'studied_with',
  'created_by',
  'located_in',
  'developed_from',
  'contradicts',
  'similar_to',
  'reminds_me_of',
  'want_to_learn',
  'connected_because',
  'custom'
];

export function ConnectionModal({
  isOpen,
  onClose,
  sourceNode,
  targetNode,
  onConnected
}: ConnectionModalProps) {
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('related_to');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState(3);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !sourceNode || !targetNode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceNodeId: sourceNode.id,
          targetNodeId: targetNode.id,
          relationshipType,
          label: label.trim() || relationshipType.replace('_', ' '),
          description: description.trim(),
          strength
        })
      });
      const data = await res.json();
      if (onConnected) onConnected(data);
      onClose();
    } catch (err) {
      console.error('Connection creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
            <Link2 size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
              CONNECT UNIVERSE NODES
            </span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'var(--bg-abyss)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sourceNode.title}</div>
            <ArrowRight size={16} color="var(--accent-gold)" />
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{targetNode.title}</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              RELATIONSHIP SEMANTICS
            </label>
            <select
              value={relationshipType}
              onChange={e => setRelationshipType(e.target.value as RelationshipType)}
              style={{ width: '100%' }}
            >
              {RELATIONSHIP_TYPES.map(r => (
                <option key={r} value={r}>
                  {r.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              CUSTOM EDGE LABEL (DISPLAYED ON GRAPH)
            </label>
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. ruled by, projected across, formulated, embodies..."
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              PERSONAL CONNECTION NOTES (WHY ARE THEY CONNECTED?)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain the personal or historical connection between these two nodes..."
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
              CONNECTION STRENGTH (1 TO 5)
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={strength}
              onChange={e => setStrength(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>Subtle connection</span>
              <span>Primary lifeline</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
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
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--accent-gold)',
                color: 'var(--bg-abyss)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <span>{loading ? 'Connecting...' : 'Establish Connection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
