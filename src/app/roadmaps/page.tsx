'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Milestone, CheckCircle2, Circle, ArrowRight, Plus } from 'lucide-react';
import { CreateNodeModal } from '@/components/common/CreateNodeModal';
import { NodeItem } from '@/lib/types';
import styles from '../page.module.css';

export default function RoadmapsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [skillNodes, setSkillNodes] = useState<NodeItem[]>([]);

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
