'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import styles from './StatsLedger.module.css';

interface StatsLedgerProps {
  totalNodes: number;
  totalConnections: number;
  distinctDisciplines: number;
  totalSources: number;
}

export function StatsLedger({
  totalNodes,
  totalConnections,
  distinctDisciplines,
  totalSources
}: StatsLedgerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const numRef1 = useRef<HTMLDivElement>(null);
  const numRef2 = useRef<HTMLDivElement>(null);
  const numRef3 = useRef<HTMLDivElement>(null);
  const numRef4 = useRef<HTMLDivElement>(null);

  const [hasTriggered, setHasTriggered] = useState(false);

  // Scroll-into-view trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // GSAP mechanical count-up animation on scroll-into-view
  useEffect(() => {
    if (!hasTriggered) return;

    const targets = [
      { el: numRef1.current, val: totalNodes },
      { el: numRef2.current, val: totalConnections },
      { el: numRef3.current, val: distinctDisciplines },
      { el: numRef4.current, val: totalSources }
    ];

    targets.forEach((target, idx) => {
      if (!target.el) return;
      const obj = { count: 0 };
      gsap.to(obj, {
        count: target.val,
        duration: 1.3,
        ease: 'power2.out',
        delay: idx * 0.08,
        onUpdate: () => {
          if (target.el) {
            target.el.textContent = Math.round(obj.count).toLocaleString();
          }
        }
      });
    });
  }, [hasTriggered, totalNodes, totalConnections, distinctDisciplines, totalSources]);

  return (
    <div ref={containerRef} className={styles.ledgerStrip}>
      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>01 // NODES</div>
        <div ref={numRef1} className={styles.cellNumber}>
          {hasTriggered ? totalNodes : 0}
        </div>
        <div className={styles.cellLabel}>Entities Indexed</div>
      </div>

      <div className={styles.ledgerDivider} />

      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>02 // SYNAPSES</div>
        <div ref={numRef2} className={styles.cellNumber}>
          {hasTriggered ? totalConnections : 0}
        </div>
        <div className={styles.cellLabel}>Active Relationships</div>
      </div>

      <div className={styles.ledgerDivider} />

      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>03 // DOMAINS</div>
        <div ref={numRef3} className={styles.cellNumber}>
          {hasTriggered ? distinctDisciplines : 0}
        </div>
        <div className={styles.cellLabel}>Disciplines Mapped</div>
      </div>

      <div className={styles.ledgerDivider} />

      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>04 // PROVENANCE</div>
        <div ref={numRef4} className={styles.cellNumber}>
          {hasTriggered ? totalSources : 0}
        </div>
        <div className={styles.cellLabel}>Citations & Sources</div>
      </div>
    </div>
  );
}
