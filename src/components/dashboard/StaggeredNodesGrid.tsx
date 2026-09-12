'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NodeItem } from '@/lib/types';
import { NodeCard } from '@/components/cards/NodeCard';
import styles from './StaggeredNodesGrid.module.css';

interface StaggeredNodesGridProps {
  nodes: NodeItem[];
}

export function StaggeredNodesGrid({ nodes }: StaggeredNodesGridProps) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [gridNodes, setGridNodes] = useState<NodeItem[]>(nodes);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGridNodes(nodes.filter(n => !deletedIds.has(n.id) && !deletedIds.has(n.slug)));
  }, [nodes, deletedIds]);

  const handleDeleteNode = (nodeId: string) => {
    setDeletedIds(prev => {
      const next = new Set(prev);
      next.add(nodeId);
      return next;
    });
    setGridNodes(prev => prev.filter(n => n.id !== nodeId && n.slug !== nodeId));
  };

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll('[data-node-card="true"]');
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 16
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: 'power2.out',
          clearProps: 'opacity,visibility'
        }
      );
    },
    { scope: containerRef, dependencies: [gridNodes] }
  );

  const getColSpanClass = (index: number) => {
    if (index === 0) return styles.colSpan8;
    if (index === 1) return styles.colSpan4;
    if (index >= 2 && index <= 4) return styles.colSpan4;
    if (index >= 5 && index <= 6) return styles.colSpan6;
    return styles.colSpan4;
  };

  if (gridNodes.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(14, 15, 22, 0.4)',
          textAlign: 'center',
          color: '#8e8e9c',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ color: 'var(--accent-gold)', marginBottom: '6px' }}>// UNIVERSE BLANK SLATE</div>
        <div>No entities placed yet. Visit the Atlas canvas to create your first node.</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.grid}>
      {gridNodes.map((node, index) => (
        <NodeCard
          key={node.id}
          node={node}
          isFeatured={index === 0}
          className={getColSpanClass(index)}
          onDelete={handleDeleteNode}
        />
      ))}
    </div>
  );
}
