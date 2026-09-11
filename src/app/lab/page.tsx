'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Compass,
  Film,
  BookOpen,
  Map,
  Music,
  Eye,
  Atom,
  Archive,
  Layers,
  Sliders,
  Type
} from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import { MagneticButton } from '@/interaction/buttons/MagneticButton';
import { MorphButton } from '@/interaction/buttons/MorphButton';
import { CardTilt } from '@/interaction/cards/CardTilt';
import { TextScramble } from '@/interaction/text/TextScramble';
import { Typewriter } from '@/interaction/text/Typewriter';
import { SpatialFolder } from '@/interaction/spatial/SpatialFolder';
import { CoverFlow } from '@/interaction/carousel/CoverFlow';
import { CardSwipe } from '@/interaction/carousel/CardSwipe';
import styles from '../page.module.css';

export default function InteractionLabPage() {
  const { setCursor, resetCursor } = useInteractionStore();
  const [clickCount, setClickCount] = useState(0);

  const sampleFolderItems = [
    { id: '1', title: 'Cholas', icon: '⛵', category: 'history', subtitle: '9th–13th c.' },
    { id: '2', title: 'Camus', icon: '📖', category: 'philosophy', subtitle: 'Absurdism' },
    { id: '3', title: 'Sitar', icon: '🎸', category: 'music', subtitle: 'Raga Yaman' },
    { id: '4', title: 'Brutalism', icon: '🏛️', category: 'architecture', subtitle: 'Raw Concrete' },
    { id: '5', title: 'Muay Thai', icon: '🥊', category: 'sport', subtitle: 'Eight Limbs' },
    { id: '6', title: 'Aryabhata', icon: '🔭', category: 'astronomy', subtitle: 'Gupta Era' }
  ];

  const sampleCoverFlowItems = [
    {
      id: 'cf-1',
      title: 'Blade Runner 2049',
      subtitle: 'Denis Villeneuve · Neo-Noir Sci-Fi',
      badge: 'MASTERPIECE',
      year: '2017',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'cf-2',
      title: 'Stalker (Сталкер)',
      subtitle: 'Andrei Tarkovsky · Philosophical Cinema',
      badge: 'ARCHIVE',
      year: '1979',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'cf-3',
      title: 'The Myth of Sisyphus',
      subtitle: 'Albert Camus · Absurdist Thesis',
      badge: 'PHILOSOPHY',
      year: '1942',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'cf-4',
      title: 'Echoes of Ancient Sitar',
      subtitle: 'Ustad Shahid Parvez · Raga Yaman',
      badge: 'MUSIC',
      year: 'RECORD',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'cf-5',
      title: 'Gravitational Dynamics',
      subtitle: 'Relativistic N-Body Integrator',
      badge: 'PHYSICS',
      year: 'MODEL',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className={styles.container} style={{ paddingBottom: '140px' }}>
      <header className={styles.hero}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <span className="mono-tag" style={{ color: 'var(--accent-gold)' }}>
              Phase 02 · The Niche Interaction Laboratory
            </span>
          </div>
          <h1 className={styles.heroHeadline}>
            <TextScramble text="NICHE INTERACTION LAB" />
          </h1>
          <p className={styles.heroSubline}>
            “Where we test, prove, and master interaction physics before promoting them to the universe.”
          </p>
        </div>
      </header>

      {/* 1. Smart Cursor Playground */}
      <section>
        <div className={styles.sectionTitle}>
          <Eye size={14} color="var(--accent-gold)" />
          <span>01 · Contextual Smart Cursor Targets (Hover over each zone)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
          <div
            onMouseEnter={() => setCursor('WATCH')}
            onMouseLeave={() => resetCursor()}
            style={{
              background: 'rgba(224, 108, 117, 0.1)',
              border: '1px solid rgba(224, 108, 117, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'none'
            }}
          >
            <Film size={24} color="#e06c75" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, color: '#e06c75' }}>Cinema Zone</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Morphs to WATCH</div>
          </div>

          <div
            onMouseEnter={() => setCursor('OPEN')}
            onMouseLeave={() => resetCursor()}
            style={{
              background: 'rgba(212, 163, 115, 0.1)',
              border: '1px solid rgba(212, 163, 115, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'none'
            }}
          >
            <BookOpen size={24} color="#d4a373" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, color: '#d4a373' }}>Library Zone</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Morphs to OPEN</div>
          </div>

          <div
            onMouseEnter={() => setCursor('PAN')}
            onMouseLeave={() => resetCursor()}
            style={{
              background: 'rgba(97, 175, 239, 0.1)',
              border: '1px solid rgba(97, 175, 239, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'none'
            }}
          >
            <Map size={24} color="#61afef" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, color: '#61afef' }}>Atlas Canvas</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Morphs to PAN</div>
          </div>

          <div
            onMouseEnter={() => setCursor('PLAY')}
            onMouseLeave={() => resetCursor()}
            style={{
              background: 'rgba(226, 168, 87, 0.1)',
              border: '1px solid rgba(226, 168, 87, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'none'
            }}
          >
            <Music size={24} color="#e2a857" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, color: '#e2a857' }}>Music Room</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Morphs to PLAY</div>
          </div>

          <div
            onMouseEnter={() => setCursor('EXPLORE', 'LAB')}
            onMouseLeave={() => resetCursor()}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'none'
            }}
          >
            <Atom size={24} color="#38bdf8" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, color: '#38bdf8' }}>Physics Lab</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Morphs to EXPLORE</div>
          </div>
        </div>
      </section>

      {/* 2. Magnetic Buttons & Morph Buttons */}
      <section>
        <div className={styles.sectionTitle}>
          <Compass size={14} color="var(--accent-gold)" />
          <span>02 · Button Systems (Magnetic Attraction & Spring Morphing)</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <MagneticButton strength={0.4} onClick={() => setClickCount((c) => c + 1)}>
            <div
              style={{
                background: 'var(--accent-gold)',
                color: 'var(--bg-abyss)',
                padding: '12px 24px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 650,
                fontSize: '0.9rem',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              Magnetic Spring (Clicked: {clickCount})
            </div>
          </MagneticButton>

          <MagneticButton strength={0.5}>
            <div
              style={{
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-primary)',
                padding: '12px 24px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}
            >
              Secondary Magnetic
            </div>
          </MagneticButton>

          {/* MorphButton: Morphs on click into expanded card */}
          <MorphButton label="Click to Morph Button" />
        </div>
      </section>

      {/* 3. 3D Perspective Card Tilt */}
      <section>
        <div className={styles.sectionTitle}>
          <Sparkles size={14} color="var(--accent-gold)" />
          <span>03 · 3D Angular Parallax Card Tilt</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <CardTilt maxTilt={15}>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '28px',
                height: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                THE CHOLA DYNASTY
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>
                Naval Hegemony & Indian Ocean Trade
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Move mouse over card to test real-time 3D angular perspective transforms.
              </div>
            </div>
          </CardTilt>

          <CardTilt maxTilt={15}>
            <div
              style={{
                background: 'linear-gradient(145deg, #181822 0%, #0d0d12 100%)',
                border: '1px solid var(--border-focus)',
                borderRadius: 'var(--radius-sm)',
                padding: '28px',
                height: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-sage)' }}>
                ALBERT CAMUS · ABSURDISM
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>
                “One must imagine Sisyphus happy.”
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Interactive resistance against an indifferent universe.
              </div>
            </div>
          </CardTilt>
        </div>
      </section>

      {/* 4. Kinetic Typography */}
      <section>
        <div className={styles.sectionTitle}>
          <Type size={14} color="var(--accent-gold)" />
          <span>04 · Kinetic Typography (Typewriter & Matrix Scramble)</span>
        </div>

        <div
          style={{
            background: 'rgba(15, 15, 20, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '28px 32px'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#8b8b99', textTransform: 'uppercase', marginBottom: '8px' }}>
            Typewriter Engine:
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: '1.8rem',
              color: '#ffffff',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typewriter
              words={[
                '“There is no sun without shadow, and it is essential to know the black night.”',
                '“The struggle itself toward the heights is enough to fill a human heart.”',
                '“In the depth of winter, I finally learned that within me lay an invincible summer.”'
              ]}
              typingSpeed={60}
              deletingSpeed={30}
              delayBetweenWords={2600}
            />
          </div>
        </div>
      </section>

      {/* 5. 3D CoverFlow Carousel */}
      <section>
        <div className={styles.sectionTitle}>
          <Layers size={14} color="var(--accent-gold)" />
          <span>05 · 3D CoverFlow Carousel (Interactive angled perspective)</span>
        </div>

        <div
          style={{
            background: 'rgba(12, 12, 16, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px 16px'
          }}
        >
          <CoverFlow items={sampleCoverFlowItems} height={440} />
        </div>
      </section>

      {/* 6. 3D Rotating Card Swipe Carousel */}
      <section>
        <div className={styles.sectionTitle}>
          <Sparkles size={14} color="var(--accent-gold)" />
          <span>06 · 3D Perspective Card Swipe (Draggable with dynamic Y-axis angular rotation)</span>
        </div>

        <div
          style={{
            background: 'rgba(12, 12, 16, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '32px 16px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CardSwipe />
        </div>
      </section>

      {/* 7. Spatial Folder Interaction */}
      <section>
        <div className={styles.sectionTitle}>
          <Compass size={14} color="var(--accent-gold)" />
          <span>07 · The Spatial Folder (Click to expand dimensionally)</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <SpatialFolder
            title="Core Pursuits"
            items={sampleFolderItems}
            onSelectItem={(item) => alert(`Selected ${item.title} from Spatial Folder!`)}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', lineHeight: 1.5 }}>
            Click the folder icon to expand into a full-scale dimensional grid, mimicking the iPhone spatial folder metaphor.
          </p>
        </div>
      </section>
    </div>
  );
}
