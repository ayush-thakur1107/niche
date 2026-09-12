'use client';

import React, { useState, useId, type ReactNode, type FC } from 'react';
import { motion } from 'motion/react';
import { useInteractionStore } from '../store';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  accentColor?: string;
}

export interface FluidTabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultActive?: string;
  onChange?: (id: string) => void;
  className?: string;
  layoutId?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'astronomical' | 'dark-tactile' | 'gold-accent';
}

export const FluidTabs: FC<FluidTabsProps> = ({
  tabs,
  activeTab: controlledActive,
  defaultActive = tabs[0]?.id,
  onChange,
  className = '',
  layoutId: customLayoutId,
  size = 'md',
  theme = 'astronomical',
}) => {
  const [internalActive, setInternalActive] = useState<string>(defaultActive);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const autoId = useId();
  const layoutId = customLayoutId || `fluid-tab-pill-${autoId}`;
  const { setCursor, resetCursor } = useInteractionStore();

  const currentActive = controlledActive !== undefined ? controlledActive : internalActive;

  const handleChange = (id: string) => {
    if (controlledActive === undefined) {
      setInternalActive(id);
    }
    onChange?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length;
      handleChange(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      handleChange(tabs[prevIndex].id);
    }
  };

  const sizeConfigs = {
    sm: {
      containerPadding: '3px',
      tabPadding: '5px 12px',
      fontSize: '0.78rem',
      iconSize: 14,
      gap: '3px',
      itemGap: '6px',
    },
    md: {
      containerPadding: '3px 4px',
      tabPadding: '7px 16px',
      fontSize: '0.84rem',
      iconSize: 16,
      gap: '4px',
      itemGap: '7px',
    },
    lg: {
      containerPadding: '4px 5px',
      tabPadding: '10px 20px',
      fontSize: '0.92rem',
      iconSize: 18,
      gap: '6px',
      itemGap: '9px',
    },
  }[size];

  return (
    <div
      role="tablist"
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeConfigs.gap,
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(10, 11, 16, 0.72)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        padding: sizeConfigs.containerPadding,
        boxShadow:
          '0 8px 30px -4px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 0 12px rgba(0, 0, 0, 0.35)',
        userSelect: 'none',
        maxWidth: '100%',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        boxSizing: 'border-box',
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = currentActive === tab.id;
        const isHovered = hoveredTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseEnter={() => {
              setHoveredTab(tab.id);
              setCursor('OPEN', 'TAB');
            }}
            onMouseLeave={() => {
              setHoveredTab(null);
              resetCursor();
            }}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              padding: sizeConfigs.tabPadding,
              border: 'none',
              background: isHovered && !isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
              outline: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              transition: 'background-color 0.18s ease, transform 0.18s ease',
              transform: isHovered && !isActive ? 'translateY(-0.5px)' : 'translateY(0)',
            }}
          >
            {/* Sliding Spring Active Capsule: Soft, translucent physical surface */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 340,
                  damping: 28,
                  mass: 0.65,
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.13)',
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.045) 100%)',
                  boxShadow:
                    '0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  zIndex: 1,
                }}
              />
            )}

            {/* Fluid typography & tactile icon */}
            <motion.div
              transition={{
                duration: 0.22,
                ease: 'easeOut',
              }}
              animate={{
                filter: isActive
                  ? ['blur(0px)', 'blur(2.5px)', 'blur(0px)']
                  : 'blur(0px)',
              }}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: sizeConfigs.itemGap,
                fontSize: sizeConfigs.fontSize,
                fontWeight: isActive ? 550 : 450,
                color: isActive
                  ? '#f4f3ef'
                  : isHovered
                  ? '#d8d7d3'
                  : '#7e808c',
                fontFamily:
                  'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                transition: 'color 0.18s ease',
              }}
            >
              {tab.icon && (
                <motion.div
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  transition={{
                    scale: { type: 'spring', stiffness: 320, damping: 20 },
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: isActive
                      ? '#f4f3ef'
                      : isHovered
                      ? '#d8d7d3'
                      : '#70727e',
                    transition: 'color 0.18s ease',
                  }}
                >
                  {tab.icon}
                </motion.div>
              )}

              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 600,
                    padding: '1px 5px',
                    borderRadius: '999px',
                    background: isActive
                      ? 'rgba(226, 168, 87, 0.14)'
                      : 'rgba(255, 255, 255, 0.06)',
                    border: isActive
                      ? '1px solid rgba(226, 168, 87, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#e2a857' : '#888995',
                    marginLeft: '2px',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </motion.div>
          </button>
        );
      })}
    </div>
  );
};

export default FluidTabs;
