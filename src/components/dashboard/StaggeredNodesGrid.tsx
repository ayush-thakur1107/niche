'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NodeItem } from '@/lib/types';
import { NodeCard } from '@/components/cards/NodeCard';
import styles from './StaggeredNodesGrid.module.css';

interface StaggeredNodesGridProps {
  nodes: NodeItem[];
}

export function StaggeredNodesGrid({ nodes }: StaggeredNodesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll('[data-node-card="true"]');
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.05, // 50ms stagger per brief
          ease: 'power3.out',
          clearProps: 'opacity,visibility'
        }
      );
    },
    { scope: containerRef, dependencies: [nodes] }
  );

  return (
    <div ref={containerRef} className={styles.grid}>
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </div>
  );
}
