'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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

  useGSAP(
    () => {
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
          duration: 1.2,
          ease: 'power2.out',
          delay: 0.1 + idx * 0.08,
          onUpdate: () => {
            if (target.el) {
              target.el.textContent = Math.round(obj.count).toLocaleString();
            }
          }
        });
      });
    },
    { scope: containerRef, dependencies: [totalNodes, totalConnections, distinctDisciplines, totalSources] }
  );

  return (
    <div ref={containerRef} className={styles.ledgerStrip}>
      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>01 / NODES</div>
        <div ref={numRef1} className={styles.cellNumber}>
          {totalNodes}
        </div>
        <div className={styles.cellLabel}>Total Universe Entities</div>
      </div>

      <div className={styles.ledgerDivider} />

      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>02 / CONNECTIONS</div>
        <div ref={numRef2} className={styles.cellNumber}>
          {totalConnections}
        </div>
        <div className={styles.cellLabel}>Established Synapses</div>
      </div>

      <div className={styles.ledgerDivider} />

      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>03 / DISCIPLINES</div>
        <div ref={numRef3} className={styles.cellNumber}>
          {distinctDisciplines}
        </div>
        <div className={styles.cellLabel}>Knowledge Domains</div>
      </div>

      <div className={styles.ledgerDivider} />

      <div className={styles.ledgerCell}>
        <div className={styles.cellIndex}>04 / CITATIONS</div>
        <div ref={numRef4} className={styles.cellNumber}>
          {totalSources}
        </div>
        <div className={styles.cellLabel}>Verified Provenance Sources</div>
      </div>
    </div>
  );
}
