'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink, ArrowRight, Trash2, BookOpen, Compass, Edit3, Check, Loader2 } from 'lucide-react';
import { NodeItem, ConnectionItem, LEARNING_STATE_LABELS, LearningState, isCreativeWork } from '@/lib/types';
import styles from './InspectorDrawer.module.css';

interface InspectorDrawerProps {
  node: (NodeItem & { connections?: ConnectionItem[] }) | null;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onNodeUpdated?: (updatedNode: NodeItem) => void;
}

export function InspectorDrawer({
  node,
  onClose,
  onSelectNode,
  onDeleteNode,
  onNodeUpdated
}: InspectorDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editWhyCare, setEditWhyCare] = useState('');
  const [editLevel, setEditLevel] = useState<LearningState>(2);
  const [editTags, setEditTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (node) {
      setEditTitle(node.title || '');
      setEditSummary(node.summary || '');
      setEditWhyCare(node.whyCare || '');
      setEditLevel(node.learningState ?? 2);
      setEditTags((node.tags || []).join(', '));
      setIsEditing(false);
    }
  }, [node]);

  if (!node) return null;

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      setSaving(true);
      const tagsArray = editTags
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      const res = await fetch(`/api/nodes/${node.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          summary: editSummary.trim(),
          whyCare: editWhyCare.trim(),
          learningState: Number(editLevel),
          tags: tagsArray
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setIsEditing(false);
        if (onNodeUpdated) {
          onNodeUpdated(updated);
        }
      }
    } catch (err) {
      console.error('Failed to update node:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    try {
      if (onDeleteNode) {
        onDeleteNode(node.id);
      } else {
        await fetch(`/api/nodes/${node.id}`, { method: 'DELETE' });
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete node:', err);
    }
  };

  return (
    <div className={styles.drawer}>
      <div className={styles.header}>
        <div className={styles.titleSection} style={{ flex: 1 }}>
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
                Lvl {isEditing ? editLevel : node.learningState} · {LEARNING_STATE_LABELS[isEditing ? editLevel : node.learningState]}
              </span>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Entity title..."
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-focus)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '1.1rem',
                padding: '4px 8px',
                width: '95%',
                marginTop: '4px'
              }}
            />
          ) : (
            <div className={styles.title}>{node.title}</div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={styles.headerActionBtn}
            title={isEditing ? 'Cancel Edit' : 'Edit Node'}
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={handleDelete}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className={styles.headerDeleteBtn}
            style={confirmDelete ? { background: 'rgba(239, 68, 68, 0.28)', borderColor: '#ef4444', color: '#fff' } : undefined}
            title={confirmDelete ? `Click again to confirm deleting "${node.title}"` : `Delete "${node.title}"`}
          >
            <Trash2 size={15} />
          </button>
          <button onClick={onClose} className={styles.headerActionBtn} title="Close Inspector">
            <X size={17} />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!isCreativeWork(node.type) && (
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  LEARNING LEVEL (0–7)
                </label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(Number(e.target.value) as LearningState)}
                  style={{ width: '100%', padding: '6px 8px', background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', color: '#f0f0f5', borderRadius: '4px' }}
                >
                  {Object.entries(LEARNING_STATE_LABELS).map(([lvl, label]) => (
                    <option key={lvl} value={lvl}>
                      {lvl} — {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                ESSENCE / SUMMARY
              </label>
              <textarea
                rows={3}
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                placeholder="Concise summary..."
                style={{ width: '100%', padding: '6px 8px', background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', color: '#f0f0f5', borderRadius: '4px', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', marginBottom: '4px' }}>
                WHY I CARE (PERSONAL INTENT)
              </label>
              <textarea
                rows={3}
                value={editWhyCare}
                onChange={(e) => setEditWhyCare(e.target.value)}
                placeholder="Why this matters to me..."
                style={{ width: '100%', padding: '6px 8px', background: 'var(--bg-surface-raised)', border: '1px solid var(--border-focus)', color: '#f0f0f5', borderRadius: '4px', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                TAGS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                style={{ width: '100%', padding: '6px 8px', background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', color: '#f0f0f5', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving || !editTitle.trim()}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'var(--accent-gold)',
                  color: 'var(--bg-abyss)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {node.summary && (
              <div className={styles.section}>
                <div className={styles.sectionLabel}>Essence</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{node.summary}</p>
              </div>
            )}

            {node.whyCare && (
              <div className={styles.section}>
                <div className={styles.sectionLabel}>Why I Care (Personal Intent)</div>
                <div className={styles.whyCareBox}>“{node.whyCare}”</div>
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
                  {node.tags.map((t) => (
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
          </>
        )}
      </div>

      <div className={styles.footer}>
        <Link href={`/node/${node.slug || node.id}`} className={styles.openPageBtn}>
          <BookOpen size={15} />
          <span>Open Full Node Page</span>
        </Link>

        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={confirmDelete ? { background: 'rgba(239, 68, 68, 0.28)', borderColor: '#ef4444', color: '#fff' } : undefined}
          title={confirmDelete ? `Click again to confirm deleting "${node.title}"` : `Delete "${node.title}" from universe`}
        >
          <Trash2 size={14} />
          <span>{confirmDelete ? 'Confirm?' : 'Delete'}</span>
        </button>
      </div>
    </div>
  );
}
