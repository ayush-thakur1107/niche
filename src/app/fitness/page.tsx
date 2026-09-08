'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dumbbell, TrendingUp, Trophy, Plus } from 'lucide-react';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { NodeItem } from '@/lib/types';
import styles from '../page.module.css';

export default function FitnessPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customExercises, setCustomExercises] = useState<NodeItem[]>([]);

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const fit = data.filter(
            n => n.tags.includes('fitness') || n.tags.includes('exercise') || n.tags.includes('training') || n.type === 'SPORT'
          );
          setCustomExercises(fit);
        }
      })
      .catch(() => {});
  }, []);

  const exercises = [
    {
      name: 'Hammer Curls (Strict)',
      muscle: 'Brachialis / Forearms',
      progression: ['12.5 kg', '15.0 kg', '17.5 kg (Current PR)'],
      pr: '17.5 kg × 8 clean reps',
      notes: 'Zero elbow swing, 2-second eccentric phase.'
    },
    {
      name: 'Muay Thai Teep & Switch Kick',
      muscle: 'Hip flexors / Core / Dynamic Balance',
      progression: ['Bag balance', 'Pad combinations', 'Clean switch teep'],
      pr: '5 × 3 min rounds uninterrupted',
      notes: 'Focus on turning the hip over on right roundhouse.'
    },
    {
      name: 'Deadlift (Conventional)',
      muscle: 'Posterior chain',
      progression: ['100 kg', '120 kg', '140 kg'],
      pr: '140 kg × 5 reps',
      notes: 'Double overhand with straps on top sets.'
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.hero} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Dumbbell size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>Capability & Physical Progression</span>
          </div>
          <h1 className={styles.heroHeadline}>BODY & DISCIPLINE</h1>
          <p className={styles.heroSubline}>
            “What am I capable of now compared with myself before?”
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
            color: '#08080a',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            fontWeight: 650,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          <Plus size={14} />
          <span>Log Exercise</span>
        </button>
      </header>

      {/* Philosophical premise callout */}
      <section className={styles.spotlightCard} style={{ borderLeftColor: 'var(--accent-sage)' }}>
        <div>
          <div style={{ color: 'var(--accent-sage)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            THE ANTI-FLEXING PRINCIPLE
          </div>
          <div className={styles.spotlightTitle} style={{ fontSize: '1.4rem' }}>
            Not For Social Validation. A Record of Tangible Physical Capacity.
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            No public vanity metrics or gamified streaks. Only an honest ledger of strength, endurance, and bodily self-mastery.
          </p>
        </div>
      </section>

      <section>
        <div className={styles.sectionTitle}>Tracked Disciplines & Progression Paths</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {exercises.map((ex, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                    {ex.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {ex.muscle}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-gold-bg)', padding: '4px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-focus)' }}>
                  <Trophy size={13} color="var(--accent-gold)" />
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    {ex.pr}
                  </span>
                </div>
              </div>

              {/* Trajectory */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <TrendingUp size={14} color="var(--accent-sage)" />
                <span>Progression: </span>
                {ex.progression.map((step, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <span style={{ color: sIdx === ex.progression.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {step}
                    </span>
                    {sIdx < ex.progression.length - 1 && <span>→</span>}
                  </React.Fragment>
                ))}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border-faint)', paddingTop: '8px' }}>
                Note: {ex.notes}
              </p>
            </div>
          ))}

          {customExercises.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}>
                Custom Physical Records & Workouts ({customExercises.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {customExercises.map(ex => (
                  <Link
                    key={ex.id}
                    href={`/node/${ex.slug || ex.id}`}
                    style={{
                      display: 'block',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '18px 20px',
                      textDecoration: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-sage)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                        PHYSICAL CAPACITY
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Level {ex.learningState} / 7
                      </span>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', margin: '6px 0' }}>
                      {ex.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {ex.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add Exercise Modal */}
      <CreateNodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="SPORT"
        defaultTags={['fitness', 'exercise', 'training']}
        onNodeCreated={(newEx) => {
          setCustomExercises(prev => [newEx, ...prev]);
        }}
      />
    </div>
  );
}
