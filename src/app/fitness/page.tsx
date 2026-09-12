'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, TrendingUp, Trophy, Plus, Trash2 } from 'lucide-react';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { NodeItem } from '@/lib/types';
import styles from '../page.module.css';

export default function FitnessPage() {
  const router = useRouter();
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

  const handleDeleteExercise = async (e: React.MouseEvent, ex: NodeItem) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/nodes/${ex.id}`, { method: 'DELETE' });
      if (res.ok || res.status === 404) {
        setCustomExercises(prev => prev.filter(item => item.id !== ex.id));
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete exercise:', err);
      setCustomExercises(prev => prev.filter(item => item.id !== ex.id));
    }
  };

  const exercises: Array<{
    name: string;
    muscle: string;
    progression: string[];
    pr: string;
    notes: string;
  }> = [];

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

        {exercises.length === 0 && customExercises.length === 0 && (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            <Dumbbell size={28} color="var(--accent-gold)" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
              No physical disciplines recorded yet
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              Log tangible physical capabilities, strength milestones, movement conditioning, or personal records without social vanity.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                background: 'linear-gradient(135deg, #e2a857 0%, #c48b3c 100%)',
                color: '#08080a',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              <Plus size={15} />
              <span>Log Your First Exercise</span>
            </button>
          </div>
        )}

        {exercises.length > 0 && (
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
          </div>
        )}

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Level {ex.learningState} / 7
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteExercise(e, ex)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.22)',
                          color: '#f87171',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.22)';
                          e.currentTarget.style.color = '#f87171';
                        }}
                        title={`Delete "${ex.title}"`}
                        aria-label={`Delete "${ex.title}"`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
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
