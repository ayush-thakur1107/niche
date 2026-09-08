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
    { scope: containerRef, dependencies: [nodes] }
  );

  const getColSpanClass = (index: number) => {
    if (index === 0) return styles.colSpan8;
    if (index === 1) return styles.colSpan4;
    if (index >= 2 && index <= 4) return styles.colSpan4;
    if (index >= 5 && index <= 6) return styles.colSpan6;
    return styles.colSpan4;
  };

  return (
    <div ref={containerRef} className={styles.grid}>
      {nodes.map((node, index) => (
        <NodeCard
          key={node.id}
          node={node}
          isFeatured={index === 0}
          className={getColSpanClass(index)}
        />
      ))}
    </div>
  );
}
