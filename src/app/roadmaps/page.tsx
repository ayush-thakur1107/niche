import React from 'react';
import Link from 'next/link';
import { Milestone, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import styles from '../page.module.css';

export default function RoadmapsPage() {
  const roadmaps = [
    {
      id: 'rm-1',
      title: 'Master Indian Ocean Maritime History & Classical India',
      goal: 'Understand the economic, geopolitical, and nautical mechanisms connecting Ancient Tamil kingdoms to Southeast Asia.',
      progress: 60,
      milestones: [
        { label: 'Read Ashokan inscriptions and Sangam literature references', done: true },
        { label: 'Map out Chola naval raid of 1025 CE on Srivijaya', done: true },
        { label: 'Study monsoon wind reversal windows and ship construction', done: false },
        { label: 'Synthesize paper on Indian Ocean merchant guilds', done: false }
      ]
    },
    {
      id: 'rm-2',
      title: 'Physical Competence & Combat Conditioning',
      goal: 'Achieve 20 kg strict hammer curls and fluid Muay Thai switch-kick combos.',
      progress: 75,
      milestones: [
        { label: '12.5 kg to 15 kg hammer curl strict sets', done: true },
        { label: '17.5 kg strict sets achieved', done: true },
        { label: 'Clean lead teep and horizontal elbow slices', done: true },
        { label: '20 kg dumbbell strict hammer curls', done: false }
      ]
    },
    {
      id: 'rm-3',
      title: 'Bespoke Tailoring & Sartorial Fluency',
      goal: 'Develop the cultural fluency to recognize hand-stitched floating canvas, chest balance, and drape.',
      progress: 40,
      milestones: [
        { label: 'Understand difference between fused and full canvas chests', done: true },
        { label: 'Recognize balance adjustments for forward-sloping shoulders', done: true },
        { label: 'Draft basic trouser pattern geometry', done: false }
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Milestone size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Maps of Becoming</span>
          </div>
          <h1 className={styles.heroHeadline}>ROADMAPS</h1>
          <p className={styles.heroSubline}>
            “Not a task checklist. A visual trajectory of personal transformation.”
          </p>
        </div>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {roadmaps.map(rm => (
          <div
            key={rm.id}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                  {rm.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                  {rm.goal}
                </p>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                {rm.progress}%
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', background: 'var(--bg-surface-raised)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${rm.progress}%`, height: '100%', background: 'var(--accent-gold)' }} />
            </div>

            {/* Milestones list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {rm.milestones.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.82rem',
                    color: m.done ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  {m.done ? (
                    <CheckCircle2 size={15} color="var(--accent-sage)" />
                  ) : (
                    <Circle size={15} color="var(--text-faint)" />
                  )}
                  <span style={{ textDecoration: m.done ? 'none' : 'none' }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
