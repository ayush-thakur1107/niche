'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Milestone, CheckCircle2, Circle, ArrowRight, Plus, Trash2 } from 'lucide-react';
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

const DEFAULT_ROADMAPS: RoadmapItem[] = [];

export default function RoadmapsPage() {
  const [skillNodes, setSkillNodes] = useState<NodeItem[]>([]);
  const [roadmapsList, setRoadmapsList] = useState<RoadmapItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDeleteRoadmap = async (e: React.MouseEvent, rmId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete roadmap "${title}"?`)) {
      const updated = roadmapsList.filter(r => r.id !== rmId);
      setRoadmapsList(updated);
      try {
        localStorage.setItem('niche:roadmaps:v2', JSON.stringify(updated));
        await fetch(`/api/nodes/${rmId}`, { method: 'DELETE' }).catch(() => {});
        setSkillNodes(prev => prev.filter(s => s.id !== rmId));
      } catch (err) {
        console.error('Failed to delete roadmap:', err);
      }
    }
  };

  const handleDeleteSkillNode = async (e: React.MouseEvent, node: NodeItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${node.title}" from mastery skills?`)) {
      try {
        await fetch(`/api/nodes/${node.id}`, { method: 'DELETE' });
        setSkillNodes(prev => prev.filter(s => s.id !== node.id));
        const updatedRoadmaps = roadmapsList.filter(r => r.id !== node.id);
        setRoadmapsList(updatedRoadmaps);
        localStorage.setItem('niche:roadmaps:v2', JSON.stringify(updatedRoadmaps));
      } catch (err) {
        console.error('Failed to delete skill node:', err);
      }
    }
  };

  // Load persisted milestones from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('niche:roadmaps:v1');
      const saved = localStorage.getItem('niche:roadmaps:v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
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
        localStorage.setItem('niche:roadmaps:v2', JSON.stringify(next));
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: isComplete ? 'var(--accent-sage)' : 'var(--accent-gold)', fontWeight: 650 }}>
                      {progressPercent}%
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {completed} of {total} Done
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteRoadmap(e, rm.id, rm.title)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '30px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#f87171',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)';
                      e.currentTarget.style.borderColor = '#ef4444';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                      e.currentTarget.style.color = '#f87171';
                    }}
                    title={`Delete roadmap "${rm.title}"`}
                    aria-label={`Delete roadmap "${rm.title}"`}
                  >
                    <Trash2 size={14} />
                  </button>
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

        {roadmapsList.length === 0 && skillNodes.length === 0 && (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.015)'
            }}
          >
            <Milestone size={28} color="var(--accent-gold)" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
              No roadmaps or masteries created yet
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              Maps of Becoming are visual trajectories of personal transformation. Set up a multi-phase mastery trajectory with interactive milestones.
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
              <span>Create Your First Roadmap</span>
            </button>
          </div>
        )}

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Level {node.learningState} / 7
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSkillNode(e, node)}
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
                        title={`Delete "${node.title}"`}
                        aria-label={`Delete "${node.title}"`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
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
          const newRoadmap: RoadmapItem = {
            id: newNode.id,
            title: newNode.title,
            goal: newNode.summary || 'Trajectory towards mastery and skill acquisition',
            milestones: [
              { id: `${newNode.id}-m1`, label: `Phase 1: Foundational grammar and principles of ${newNode.title}`, done: false },
              { id: `${newNode.id}-m2`, label: `Phase 2: Deliberate practice drills and pattern recognition`, done: false },
              { id: `${newNode.id}-m3`, label: `Phase 3: High-pressure application and creative synthesis`, done: false },
              { id: `${newNode.id}-m4`, label: `Phase 4: Autonomous mastery and intuition`, done: false }
            ]
          };
          setRoadmapsList(prev => {
            const next = [newRoadmap, ...prev];
            try {
              localStorage.setItem('niche:roadmaps:v2', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
        }}
      />
    </div>
  );
}
