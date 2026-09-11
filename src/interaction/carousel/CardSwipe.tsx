'use client';

import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Transition,
} from 'motion/react';
import {
  BookOpen,
  Droplets,
  Zap,
  Activity,
  Brain,
  Film,
  Compass,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useInteractionStore } from '../store';

export interface CardSwipeItem {
  id: string | number;
  title: string;
  description: string;
  category?: string;
  icon?: ReactNode | ((theme?: 'light' | 'dark') => ReactNode);
  ctaLabel?: string;
  onCtaClick?: (item: CardSwipeItem) => void;
  href?: string;
  accentColor?: string;
}

export interface CardSwipeProps {
  items?: CardSwipeItem[];
  itemWidth?: number;
  cardHeight?: number;
  gap?: number;
  className?: string;
  onSelect?: (item: CardSwipeItem, index: number) => void;
  showNavButtons?: boolean;
}

export const DEFAULT_SWIPE_CARDS: CardSwipeItem[] = [
  {
    id: 1,
    title: 'Intellectual Canon',
    category: 'PHILOSOPHY',
    description: 'Sharpen your mental models & discover transformative timeless theses.',
    icon: <BookOpen size={42} color="var(--accent-gold, #e2a857)" strokeWidth={1.5} />,
    accentColor: '#e2a857',
    ctaLabel: 'Explore Canon',
  },
  {
    id: 2,
    title: 'Cinematheque',
    category: 'FILM ARCHIVE',
    description: 'Masterworks of cinema analyzed as visual philosophy and resonance.',
    icon: <Film size={42} color="var(--accent-amethyst, #a87be6)" strokeWidth={1.5} />,
    accentColor: '#a87be6',
    ctaLabel: 'Watch Film',
  },
  {
    id: 3,
    title: 'Atlas Canvas',
    category: 'CARTOGRAPHY',
    description: 'Multi-dimensional knowledge graphs linking disciplines and eras.',
    icon: <Compass size={42} color="var(--accent-sage, #78c2ad)" strokeWidth={1.5} />,
    accentColor: '#78c2ad',
    ctaLabel: 'Open Atlas',
  },
  {
    id: 4,
    title: 'Deep Meditation',
    category: 'MINDFULNESS',
    description: 'Calm the mind in high-entropy states. Just 5 minutes resets focus.',
    icon: <Brain size={42} color="#38bdf8" strokeWidth={1.5} />,
    accentColor: '#38bdf8',
    ctaLabel: 'Begin Session',
  },
  {
    id: 5,
    title: 'Kinetic Energy',
    category: 'PHYSICALITY',
    description: 'Move, train, and unleash endorphins. Physical rigor clarifies thought.',
    icon: <Activity size={42} color="#e06c75" strokeWidth={1.5} />,
    accentColor: '#e06c75',
    ctaLabel: 'Track Routine',
  },
];

const DEFAULT_ITEM_WIDTH = 320;
const DEFAULT_GAP = 18;
const DEFAULT_CARD_HEIGHT = 440;
const DRAG_BUFFER = 40;
const VELOCITY_THRESHOLD = 450;

const SPRING_OPTIONS: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 30,
  mass: 0.8,
};

interface CarouselCardProps {
  item: CardSwipeItem;
  index: number;
  x: ReturnType<typeof useMotionValue<number>>;
  itemCount: number;
  itemWidth: number;
  cardHeight: number;
  gap: number;
  containerWidth: number;
  isActive: boolean;
  onSelect?: (item: CardSwipeItem, index: number) => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({
  item,
  index,
  x,
  itemCount,
  itemWidth,
  cardHeight,
  containerWidth,
  isActive,
  onSelect,
}) => {
  const { setCursor, resetCursor } = useInteractionStore();

  const nextIndex = Math.min(index + 1, itemCount - 1);
  const prevIndex = Math.max(index - 1, 0);

  const range = [
    (-100 * (index + 1) * containerWidth) / 100,
    (-100 * index * containerWidth) / 100,
    (-100 * (index - 1) * containerWidth) / 100,
  ];
  const outputRange = [nextIndex ? 80 : 80, 0, prevIndex ? -80 : -80];

  const rotateY = useTransform(x, range, outputRange, { clamp: false });
  const opacity = useTransform(x, range, [0.35, 1, 0.35], { clamp: true });
  const scale = useTransform(x, range, [0.92, 1, 0.92], { clamp: true });

  const renderIcon = () => {
    if (!item.icon) return null;
    if (typeof item.icon === 'function') {
      return item.icon('dark');
    }
    return item.icon;
  };

  const accent = item.accentColor || 'var(--accent-gold, #e2a857)';

  return (
    <motion.div
      style={{
        width: itemWidth,
        height: cardHeight,
        rotateY,
        opacity,
        scale,
        flexShrink: 0,
        transformStyle: 'preserve-3d',
      }}
      transition={SPRING_OPTIONS}
      onMouseEnter={() => {
        setCursor('PAN', 'SWIPE');
      }}
      onMouseLeave={resetCursor}
      onClick={() => onSelect?.(item, index)}
      className="card-swipe-item"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '32px 28px',
          borderRadius: '28px',
          background: 'linear-gradient(160deg, rgba(24, 24, 32, 0.95) 0%, rgba(12, 12, 16, 0.98) 100%)',
          border: isActive
            ? `1.5px solid ${accent}`
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isActive
            ? `0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 30px ${accent}22`
            : '0 16px 32px -10px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(16px)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          userSelect: 'none',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle ambient light glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: accent,
            opacity: isActive ? 0.12 : 0.04,
            filter: 'blur(40px)',
            pointerEvents: 'none',
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Top Header with Icon and Tag */}
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              }}
            >
              {renderIcon()}
            </div>

            {item.category && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: accent,
                  background: `${accent}15`,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: `1px solid ${accent}33`,
                }}
              >
                {item.category}
              </span>
            )}
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: '1.85rem',
              fontWeight: 600,
              lineHeight: 1.2,
              color: '#ffffff',
              marginBottom: '12px',
              letterSpacing: '-0.01em',
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              fontSize: '0.92rem',
              lineHeight: 1.55,
              color: 'var(--text-secondary, #9ca3af)',
              margin: 0,
            }}
          >
            {item.description}
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            if (item.onCtaClick) {
              item.onCtaClick(item);
            } else if (onSelect) {
              onSelect(item, index);
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '14px',
            background: isActive ? accent : 'rgba(255, 255, 255, 0.08)',
            color: isActive ? '#09090b' : '#ffffff',
            fontWeight: 650,
            fontSize: '0.84rem',
            fontFamily: 'inherit',
            border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
            boxShadow: isActive ? `0 8px 20px ${accent}33` : 'none',
            transition: 'background 0.25s ease, color 0.25s ease',
          }}
        >
          <span>{item.ctaLabel || 'Get Started'}</span>
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export const CardSwipe: React.FC<CardSwipeProps> = ({
  items = DEFAULT_SWIPE_CARDS,
  itemWidth = DEFAULT_ITEM_WIDTH,
  cardHeight = DEFAULT_CARD_HEIGHT,
  gap = DEFAULT_GAP,
  className = '',
  onSelect,
  showNavButtons = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerWidth = itemWidth + gap;
  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
  };

  const leftConstraint = -((itemWidth + gap) * (items.length - 1));

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '16px 0',
      }}
    >
      {/* 3D Carousel Stage */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: `${itemWidth}px`,
          height: `${cardHeight}px`,
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: leftConstraint, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: -(currentIndex * containerWidth) }}
          transition={SPRING_OPTIONS}
          style={{
            display: 'flex',
            gap: `${gap}px`,
            perspective: 1100,
            perspectiveOrigin: `${currentIndex * containerWidth + itemWidth / 2}px 50%`,
            cursor: 'grab',
            x,
          }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {items.map((item, index) => (
            <CarouselCard
              key={item.id}
              item={item}
              index={index}
              x={x}
              itemCount={items.length}
              itemWidth={itemWidth}
              cardHeight={cardHeight}
              gap={gap}
              containerWidth={containerWidth}
              isActive={currentIndex === index}
              onSelect={onSelect}
            />
          ))}
        </motion.div>
      </div>

      {/* Navigation Controls: Buttons & Indicator Dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        {showNavButtons && (
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous card"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: currentIndex === 0 ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Progress Dots */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {items.map((_, i) => {
            const isDotActive = currentIndex === i;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                style={{
                  height: '7px',
                  width: isDotActive ? '26px' : '7px',
                  borderRadius: '4px',
                  background: isDotActive
                    ? 'var(--accent-gold, #e2a857)'
                    : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            );
          })}
        </div>

        {showNavButtons && (
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === items.length - 1}
            aria-label="Next card"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: currentIndex === items.length - 1 ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
              cursor: currentIndex === items.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CardSwipe;
