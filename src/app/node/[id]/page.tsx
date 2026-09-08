'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Globe,
  Share2,
  Trash2,
  Save,
  Check,
  ExternalLink,
  Plus,
  BookOpen,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import {
  NodeItem,
  NodeContent,
  SourceItem,
  ConnectionItem,
  SectionType,
  LearningState,
  UncertaintyLevel,
  LEARNING_STATE_LABELS,
  isCreativeWork
} from '@/lib/types';
import { ConnectionModal } from '@/components/atlas/ConnectionModal';
import styles from './page.module.css';

const SECTION_TABS: { type: SectionType; label: string }[] = [
  { type: 'USER_KNOWLEDGE', label: 'My Notes & Understanding' },
  { type: 'USER_OPINION', label: 'My Stance & Philosophy' },
  { type: 'USER_QUESTION', label: 'Unresolved Questions' },
  { type: 'EXTERNAL_CONTEXT', label: 'External Facts & Citations' },
];

export default function NodePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const nodeId = resolvedParams.id;

  const [node, setNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SectionType>('USER_KNOWLEDGE');
  const [editingContent, setEditingContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingWiki, setIsFetchingWiki] = useState(false);
  const [allNodes, setAllNodes] = useState<NodeItem[]>([]);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [targetForConnection, setTargetForConnection] = useState<NodeItem | null>(null);

  const loadNode = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/nodes/${nodeId}`);
      if (!res.ok) {
        setNode(null);
        return;
      }
      const data = await res.json();
      setNode(data);

      // Set initial content for current tab
      const currentSection = data.contents?.find((c: NodeContent) => c.sectionType === activeTab);
      setEditingContent(currentSection ? currentSection.contentMarkdown : '');
    } catch (err) {
      console.error('Failed to load node:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNode();
    // Load all nodes for connection targeting
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => setAllNodes(data || []))
      .catch(() => {});
  }, [nodeId]);

  // When active tab changes, update editor content
  useEffect(() => {
    if (node && node.contents) {
      const section = node.contents.find((c: NodeContent) => c.sectionType === activeTab);
      setEditingContent(section ? section.contentMarkdown : '');
      setIsEditing(false);
    }
  }, [activeTab, node]);

  const handleSaveContent = async () => {
    if (!node) return;
    setIsSaving(true);
    try {
      await fetch(`/api/nodes/${node.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: activeTab,
          contentMarkdown: editingContent
        })
      });
      setIsEditing(false);
      loadNode();
    } catch (err) {
      console.error('Failed to save content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchWikipedia = async () => {
    if (!node) return;
    setIsFetchingWiki(true);
    try {
      const res = await fetch('/api/providers/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: node.title,
          provider: 'wikipedia',
          nodeId: node.id
        })
      });
      if (res.ok) {
        await loadNode();
        setActiveTab('EXTERNAL_CONTEXT');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsFetchingWiki(false);
    }
  };

  const handleUpdateLearningState = async (newState: LearningState) => {
    if (!node) return;
    try {
      await fetch(`/api/nodes/${node.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learningState: newState })
      });
      setNode({ ...node, learningState: newState });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUncertainty = async (level: UncertaintyLevel) => {
    if (!node) return;
    try {
      await fetch(`/api/nodes/${node.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uncertaintyLevel: level })
      });
      setNode({ ...node, uncertaintyLevel: level });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!node) return;
    if (confirm(`Are you sure you want to delete "${node.title}" from your universe?`)) {
      await fetch(`/api/nodes/${node.id}`, { method: 'DELETE' });
      router.push('/atlas');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
          Opening entity record...
        </div>
      </div>
    );
  }

  if (!node) {
    return (
      <div className={styles.container}>
        <h2>Entity not found in this universe.</h2>
        <Link href="/atlas" style={{ marginTop: '16px' }}>← Return to Atlas</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link href="/atlas">ATLAS</Link>
        <span>/</span>
        <span>{node.type}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{node.title}</span>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.typeBadge}>
            <span>{node.type}</span>
          </div>
          <h1 className={styles.title}>{node.title}</h1>
          {node.summary && <p className={styles.summary}>{node.summary}</p>}
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.actionBtn}
            onClick={handleFetchWikipedia}
            disabled={isFetchingWiki}
            title="Query Wikipedia & attach external context"
          >
            <Globe size={14} color="var(--accent-gold)" />
            <span>{isFetchingWiki ? 'Fetching...' : 'Fetch Context'}</span>
          </button>

          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={() => setIsConnectionModalOpen(true)}
          >
            <Share2 size={14} />
            <span>Connect Node</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={handleDelete}
            title="Delete this node"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      {/* Personal Intent Card */}
      <div className={styles.intentCard}>
        <div className={styles.intentHeader}>
          <span className={styles.intentLabel}>Personal Intent & Why I Care</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            NOT EXTERNAL TRIVIA
          </span>
        </div>

        <div className={styles.intentText}>
          {node.whyCare ? `“${node.whyCare}”` : 'No personal reason recorded yet. Why does this matter to you?'}
        </div>

        <div className={styles.metricsRow}>
          {!isCreativeWork(node.type) && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Learning Competence: </span>
              <select
                value={node.learningState}
                onChange={e => handleUpdateLearningState(Number(e.target.value) as LearningState)}
                style={{
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--accent-gold)',
                  fontWeight: 600
                }}
              >
                {Object.entries(LEARNING_STATE_LABELS).map(([lvl, label]) => (
                  <option key={lvl} value={lvl}>Level {lvl} — {label}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <span style={{ color: 'var(--text-muted)' }}>State of Understanding: </span>
            <select
              value={node.uncertaintyLevel}
              onChange={e => handleUpdateUncertainty(e.target.value as UncertaintyLevel)}
              style={{
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
            >
              <option value="known">Known</option>
              <option value="partially_understood">Partially Understood</option>
              <option value="confused">Confused / Conflicting</option>
              <option value="need_research">Needs Research</option>
              <option value="question">Open Question</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {node.curiosityTrail && (
            <div style={{ color: 'var(--text-muted)' }}>
              <span>Trail: </span>
              <span style={{ color: 'var(--text-secondary)' }}>{node.curiosityTrail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Content Tabs + Side Panels */}
      <div className={styles.contentGrid}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          {/* Section Type Tabs */}
          <div className={styles.sectionTabs}>
            {SECTION_TABS.map(tab => (
              <button
                key={tab.type}
                className={`${styles.tabBtn} ${activeTab === tab.type ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab.type)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor & Preview Area */}
          <div className={styles.editorArea}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {activeTab === 'EXTERNAL_CONTEXT'
                  ? 'EXTERNAL SOURCED FACTS'
                  : 'YOUR PERSONAL INTELLECTUAL RECORD'}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {isEditing ? (
                  <>
                    <button
                      className={styles.actionBtn}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      onClick={handleSaveContent}
                      disabled={isSaving}
                    >
                      <Save size={14} />
                      <span>{isSaving ? 'Saving...' : 'Save Notes'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    className={styles.actionBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Section
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                className={styles.editorTextarea}
                value={editingContent}
                onChange={e => setEditingContent(e.target.value)}
                placeholder="Write your thoughts, synthesized notes, references (@node), questions, or arguments in Markdown..."
              />
            ) : (
              <div className={styles.markdownPreview}>
                {editingContent ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{editingContent}</div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '24px 0' }}>
                    Nothing recorded in this section yet. Click “Edit Section” to write your personal synthesis.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side Column: Relationships, Backlinks, Sources */}
        <aside className={styles.sideColumn}>
          {/* Outbound Connections */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>Connected To (Outbound)</div>
            {node.connections?.outbound && node.connections.outbound.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {node.connections.outbound.map((c: any) => (
                  <Link
                    key={c.id}
                    href={`/node/${c.targetNode?.slug || c.targetNodeId}`}
                    className={styles.connectionRow}
                  >
                    <div>
                      <div style={{ fontWeight: 550 }}>{c.targetNode?.title || 'Unknown Entity'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>
                        {c.label || c.relationshipType}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No outbound connections established.</div>
            )}
          </div>

          {/* Inbound Backlinks */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>Referenced By (Inbound)</div>
            {node.connections?.inbound && node.connections.inbound.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {node.connections.inbound.map((c: any) => (
                  <Link
                    key={c.id}
                    href={`/node/${c.sourceNode?.slug || c.sourceNodeId}`}
                    className={styles.connectionRow}
                  >
                    <div>
                      <div style={{ fontWeight: 550 }}>{c.sourceNode?.title || 'Unknown Entity'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {c.label || c.relationshipType}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>←</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No incoming references yet.</div>
            )}
          </div>

          {/* Verified Sources */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>Verified Sources & Citations</div>
            {node.sources && node.sources.length > 0 ? (
              <div className={styles.sourcesList}>
                {node.sources.map((s: SourceItem) => (
                  <div key={s.id} className={styles.sourceCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{s.provider}</span>
                      <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div style={{ marginTop: '4px', fontWeight: 500, color: 'var(--text-primary)' }}>{s.title}</div>
                    {s.summary && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {s.summary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                No external sources attached. Click “Fetch Context” to automatically cite Wikipedia.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Modal to establish new connection */}
      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        sourceNode={{ id: node.id, title: node.title }}
        targetNode={
          targetForConnection
            ? { id: targetForConnection.id, title: targetForConnection.title }
            : allNodes.find(n => n.id !== node.id) || { id: node.id, title: node.title }
        }
        onConnected={() => {
          setIsConnectionModalOpen(false);
          loadNode();
        }}
      />
    </div>
  );
}
