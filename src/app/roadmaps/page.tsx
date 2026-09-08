'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Milestone, CheckCircle2, Circle, ArrowRight, Plus } from 'lucide-react';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { NodeItem } from '@/lib/types';
import styles from '../page.module.css';


interface Milestone {
  id: string;
  label: string;
  done: boolean;
}

interface RoadmapItem {
  id: string;
  title: string;
  goal: string;
  milestones: Milestone[];
}

const DEFAULT_ROADMAPS: RoadmapItem[] = [
  {
    id: 'rm-1',
    title: 'Master Indian Ocean Maritime History & Classical India',
    goal: 'Understand the economic, geopolitical, and nautical mechanisms connecting Ancient Tamil kingdoms to Southeast Asia.',
    milestones: [
      { id: 'rm-1-1', label: 'Read Ashokan inscriptions and Sangam literature references', done: true },
      { id: 'rm-1-2', label: 'Map out Chola naval raid of 1025 CE on Srivijaya', done: true },
      { id: 'rm-1-3', label: 'Study monsoon wind reversal windows and ship construction', done: false },
      { id: 'rm-1-4', label: 'Synthesize paper on Indian Ocean merchant guilds', done: false }
    ]
  },
  {
    id: 'rm-2',
    title: 'Physical Competence & Combat Conditioning',
    goal: 'Achieve 20 kg strict hammer curls and fluid Muay Thai switch-kick combos.',
    milestones: [
      { id: 'rm-2-1', label: '12.5 kg to 15 kg hammer curl strict sets', done: true },
      { id: 'rm-2-2', label: '17.5 kg strict sets achieved', done: true },
      { id: 'rm-2-3', label: 'Clean lead teep and horizontal elbow slices', done: true },
      { id: 'rm-2-4', label: '20 kg dumbbell strict hammer curls', done: false }
    ]
  },
  {
    id: 'rm-3',
    title: 'Bespoke Tailoring & Sartorial Fluency',
    goal: 'Develop the cultural fluency to recognize hand-stitched floating canvas, chest balance, and drape.',
    milestones: [
      { id: 'rm-3-1', label: 'Understand difference between fused and full canvas chests', done: true },
      { id: 'rm-3-2', label: 'Recognize balance adjustments for forward-sloping shoulders', done: true },
      { id: 'rm-3-3', label: 'Draft basic trouser pattern geometry', done: false }
    ]
  }
];

export default function RoadmapsPage() {
  const [skillNodes, setSkillNodes] = useState<NodeItem[]>([]);
  const [roadmapsList, setRoadmapsList] = useState<RoadmapItem[]>(DEFAULT_ROADMAPS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load persisted milestones from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('niche:roadmaps:v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoadmapsList(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read roadmap state from storage', e);
    }
  }, []);

  const toggleMilestone = (roadmapId: string, milestoneId: string) => {
    setRoadmapsList(prev => {
      const next = prev.map(rm => {
        if (rm.id !== roadmapId) return rm;
        const nextMilestones = rm.milestones.map(m => {
          if (m.id !== milestoneId) return m;
          return { ...m, done: !m.done };
        });
        return { ...rm, milestones: nextMilestones };
      });

      try {
        localStorage.setItem('niche:roadmaps:v1', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not persist roadmap state', e);
      }

      return next;
    });
  };

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const skills = data.filter(
            n => n.type === 'SKILL' || n.type === 'PROJECT' || n.tags.includes('roadmap') || n.tags.includes('skill')
          );
          setSkillNodes(skills);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.hero} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
          <span>New Roadmap</span>
        </button>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {roadmapsList.map(rm => {
          const total = rm.milestones.length;
          const completed = rm.milestones.filter(m => m.done).length;
          const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isComplete = progressPercent === 100;

          return (
            <div
              key={rm.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--text-primary)' }}>
                    {rm.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                    {rm.goal}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: isComplete ? 'var(--accent-sage)' : 'var(--accent-gold)', fontWeight: 650 }}>
                    {progressPercent}%
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {completed} of {total} Done
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: isComplete ? 'var(--accent-sage)' : 'var(--accent-gold)',
                    borderRadius: '3px',
                    transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease'
                  }}
                />
              </div>

              {/* Interactive Milestones Checkboxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {rm.milestones.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMilestone(rm.id, m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: m.done ? 'rgba(91, 163, 126, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                      border: m.done ? '1px solid rgba(91, 163, 126, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      outline: 'none',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = m.done ? 'rgba(91, 163, 126, 0.12)' : 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = m.done ? 'rgba(91, 163, 126, 0.45)' : 'rgba(226, 168, 87, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = m.done ? 'rgba(91, 163, 126, 0.06)' : 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = m.done ? 'rgba(91, 163, 126, 0.25)' : 'rgba(255, 255, 255, 0.06)';
                    }}
                    title={`Click to mark ${m.done ? 'uncompleted' : 'completed'}`}
                  >
                    {m.done ? (
                      <CheckCircle2 size={16} color="var(--accent-sage)" style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle size={16} color="var(--text-faint)" style={{ flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontSize: '0.82rem',
                        lineHeight: 1.35,
                        color: m.done ? 'var(--text-primary)' : 'var(--text-muted)',
                        textDecoration: m.done ? 'line-through' : 'none',
                        opacity: m.done ? 0.9 : 0.75,
                        transition: 'color 0.18s ease, opacity 0.18s ease'
                      }}
                    >
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {skillNodes.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}>
              Custom Tracked Skills & Mastery Trajectories ({skillNodes.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              {skillNodes.map(node => (
                <Link
                  key={node.id}
                  href={`/node/${node.slug || node.id}`}
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
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                      {node.type}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Level {node.learningState} / 7
                    </span>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', margin: '6px 0' }}>
                    {node.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {node.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Add Roadmap / Skill Modal */}
      <CreateNodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="SKILL"
        defaultTags={['roadmap', 'skill', 'mastery']}
        onNodeCreated={(newNode) => {
          setSkillNodes(prev => [newNode, ...prev]);
        }}
      />
    </div>
  );
}
