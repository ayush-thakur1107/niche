import React from 'react';
import { Dumbbell, TrendingUp, Trophy } from 'lucide-react';
import styles from '../page.module.css';

export default function FitnessPage() {
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
      <header className={styles.hero}>
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
        </div>
      </section>
    </div>
  );
}
