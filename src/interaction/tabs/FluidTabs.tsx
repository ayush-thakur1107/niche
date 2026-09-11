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
  theme?: 'dark-tactile' | 'gold-accent';
}

export const FluidTabs: FC<FluidTabsProps> = ({
  tabs,
  activeTab: controlledActive,
  defaultActive = tabs[0]?.id,
  onChange,
  className = '',
  layoutId: customLayoutId,
  size = 'md',
  theme = 'dark-tactile',
}) => {
  const [internalActive, setInternalActive] = useState<string>(defaultActive);
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
      tabPadding: '6px 12px',
      fontSize: '0.8rem',
      iconSize: 16,
      gap: '4px',
      itemGap: '6px',
    },
    md: {
      containerPadding: '4px',
      tabPadding: '8px 18px',
      fontSize: '0.9rem',
      iconSize: 19,
      gap: '6px',
      itemGap: '8px',
    },
    lg: {
      containerPadding: '5px',
      tabPadding: '11px 22px',
      fontSize: '1rem',
      iconSize: 22,
      gap: '8px',
      itemGap: '10px',
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
        border: '1.6px solid #232326',
        backgroundColor: '#141415',
        padding: sizeConfigs.containerPadding,
        boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        userSelect: 'none',
        maxWidth: '100%',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        boxSizing: 'border-box',
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = currentActive === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseEnter={() => setCursor('OPEN', 'TAB')}
            onMouseLeave={resetCursor}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              padding: sizeConfigs.tabPadding,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              transition: 'color 0.2s ease',
            }}
          >
            {/* Sliding Spring Active Capsule */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 25,
                  mass: 0.8,
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  background:
                    theme === 'gold-accent'
                      ? 'linear-gradient(180deg, #d89e49 0%, #b87d2a 100%)'
                      : 'linear-gradient(180deg, #353539 0%, #222225 100%)',
                  boxShadow:
                    theme === 'gold-accent'
                      ? '0 4px 16px rgba(226, 168, 87, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                      : '0 4px 14px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
                  zIndex: 1,
                }}
              />
            )}

            {/* Fluid micro-blur & typography */}
            <motion.div
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              animate={{
                filter: isActive
                  ? ['blur(0px)', 'blur(4px)', 'blur(0px)']
                  : 'blur(0px)',
              }}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: sizeConfigs.itemGap,
                fontSize: sizeConfigs.fontSize,
                fontWeight: isActive ? 700 : 600,
                color: isActive
                  ? (theme === 'gold-accent' ? '#09090b' : '#ffffff')
                  : '#72727a',
                fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease',
              }}
            >
              {tab.icon && (
                <motion.div
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{
                    scale: { type: 'spring', stiffness: 300, damping: 15 },
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: isActive
                      ? (theme === 'gold-accent' ? '#09090b' : '#ffffff')
                      : '#72727a',
                  }}
                >
                  {tab.icon}
                </motion.div>
              )}

              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: isActive
                      ? (theme === 'gold-accent' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.16)')
                      : 'rgba(255, 255, 255, 0.08)',
                    color: isActive
                      ? (theme === 'gold-accent' ? '#09090b' : '#ffffff')
                      : '#8e8e96',
                    marginLeft: '2px',
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
