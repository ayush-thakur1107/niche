'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  Plus,
  Compass,
  Map,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Inbox
} from 'lucide-react';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateNode: () => void;
  onOpenQuickCapture: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenCreateNode,
  onOpenQuickCapture
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data.nodes) {
            setResults(data.nodes);
          }
        })
        .catch(() => {});
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length + 3));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeAction(selectedIndex);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleRandomNode = async () => {
    try {
      const res = await fetch('/api/nodes');
      const nodes = await res.json();
      if (Array.isArray(nodes) && nodes.length > 0) {
        const random = nodes[Math.floor(Math.random() * nodes.length)];
        onClose();
        router.push(`/node/${random.slug || random.id}`);
      }
    } catch {}
  };

  const executeAction = (index: number) => {
    if (results.length > 0 && index < results.length) {
      const node = results[index];
      onClose();
      router.push(`/node/${node.slug || node.id}`);
      return;
    }

    const actionIndex = index - results.length;
    if (actionIndex === 0) {
      onClose();
      onOpenCreateNode();
    } else if (actionIndex === 1) {
      handleRandomNode();
    } else if (actionIndex === 2) {
      onClose();
      onOpenQuickCapture();
    } else if (actionIndex === 3) {
      onClose();
      router.push('/atlas');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <Search className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Type a command or search nodes, notes, tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className={styles.resultsList}>
          {results.length > 0 && (
            <>
              <div className={styles.sectionHeader}>Matching Nodes</div>
              {results.map((node, i) => (
                <div
                  key={node.id}
                  className={`${styles.item} ${selectedIndex === i ? styles.itemSelected : ''}`}
                  onClick={() => executeAction(i)}
                >
                  <div className={styles.itemMain}>
                    <BookOpen className={styles.itemIcon} />
                    <div>
                      <div className={styles.itemTitle}>{node.title}</div>
                      <div className={styles.itemSnippet}>{node.type} · {node.summary?.substring(0, 70)}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} opacity={0.5} />
                </div>
              ))}
            </>
          )}

          <div className={styles.sectionHeader}>Quick Actions</div>
          <div
            className={`${styles.item} ${selectedIndex === results.length ? styles.itemSelected : ''}`}
            onClick={() => executeAction(results.length)}
          >
            <div className={styles.itemMain}>
              <Plus className={styles.itemIcon} />
              <span className={styles.itemTitle}>Create New Node...</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>⌘N</span>
          </div>

          <div
            className={`${styles.item} ${selectedIndex === results.length + 1 ? styles.itemSelected : ''}`}
            onClick={() => executeAction(results.length + 1)}
          >
            <div className={styles.itemMain}>
              <Sparkles className={styles.itemIcon} />
              <span className={styles.itemTitle}>Surprise Me (Take Me Somewhere / Random Node)</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Random</span>
          </div>

          <div
            className={`${styles.item} ${selectedIndex === results.length + 2 ? styles.itemSelected : ''}`}
            onClick={() => executeAction(results.length + 2)}
          >
            <div className={styles.itemMain}>
              <Inbox className={styles.itemIcon} />
              <span className={styles.itemTitle}>Quick Capture Thought to Inbox</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>N</span>
          </div>

          <div
            className={`${styles.item} ${selectedIndex === results.length + 3 ? styles.itemSelected : ''}`}
            onClick={() => executeAction(results.length + 3)}
          >
            <div className={styles.itemMain}>
              <Map className={styles.itemIcon} />
              <span className={styles.itemTitle}>Go to Atlas Infinite Canvas</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>G A</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.shortcuts}>
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to dismiss</span>
          </div>
          <div>AYUSH THAKUR SEARCH</div>
        </div>
      </div>
    </div>
  );
}
