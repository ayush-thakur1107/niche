'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Compass,
  Map,
  Film,
  BookOpen,
  Lightbulb,
  Milestone,
  Dumbbell,
  BookA,
  History,
  Inbox,
  User,
  Plus,
  Search,
  Music2,
  Sparkles
} from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import styles from './TopNavigation.module.css';

export interface NavTabItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface TopNavigationProps {
  onOpenCreateNode?: () => void;
  onOpenCommandPalette?: () => void;
}

export function TopNavigation({
  onOpenCreateNode,
  onOpenCommandPalette,
}: TopNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setPlayerExpanded, isPlaying, setCursor, resetCursor } = useInteractionStore();

  const [stats, setStats] = useState<{ totalNodes: number; inboxCount: number }>({
    totalNodes: 0,
    inboxCount: 0,
  });

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setStats({
            totalNodes: data.totalNodes || 0,
            inboxCount: data.inboxCount || 0,
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navTabs: NavTabItem[] = useMemo(
    () => [
      { id: '/', label: 'Overview', href: '/', icon: <Compass size={13} /> },
      { id: '/atlas', label: 'Atlas', href: '/atlas', icon: <Map size={13} /> },
      { id: '/cinema', label: 'Cinema', href: '/cinema', icon: <Film size={13} /> },
      { id: '/library', label: 'Library', href: '/library', icon: <BookOpen size={13} /> },
      { id: '/ideas', label: 'Ideas', href: '/ideas', icon: <Lightbulb size={13} /> },
      { id: '/roadmaps', label: 'Roadmaps', href: '/roadmaps', icon: <Milestone size={13} /> },
      { id: '/fitness', label: 'Body', href: '/fitness', icon: <Dumbbell size={13} /> },
      { id: '/vocabulary', label: 'Lexicon', href: '/vocabulary', icon: <BookA size={13} /> },
      { id: '/timeline', label: 'Timeline', href: '/timeline', icon: <History size={13} /> },
      {
        id: '/inbox',
        label: 'Inbox',
        href: '/inbox',
        icon: <Inbox size={13} />,
        badge: stats.inboxCount > 0 ? stats.inboxCount : undefined,
      },
      { id: '/me', label: 'Me', href: '/me', icon: <User size={13} /> },
    ],
    [stats.inboxCount]
  );

  // Active route matching
  const activeTabId = useMemo(() => {
    if (pathname === '/') return '/';
    const match = navTabs.find((t) => t.href !== '/' && pathname.startsWith(t.href));
    if (match) return match.id;
    if (pathname.startsWith('/node')) return '/atlas';
    return '/';
  }, [pathname, navTabs]);

  const handleTabClick = (tab: NavTabItem) => {
    if (pathname !== tab.href) {
      router.push(tab.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % navTabs.length;
      router.push(navTabs[nextIndex].href);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + navTabs.length) % navTabs.length;
      router.push(navTabs[prevIndex].href);
    }
  };

  return (
    <header className={styles.headerContainer} data-lenis-prevent="true">
      {/* 1. Brand Identity (Left) */}
      <Link
        href="/"
        className={styles.brandArea}
        onMouseEnter={() => setCursor('OPEN', 'HOME')}
        onMouseLeave={resetCursor}
        title="Ayush Thakur — Personal Universe"
      >
        <div className={styles.brandMonogram}>AT</div>
        <div className={styles.brandTextGroup}>
          <span className={styles.brandTitle}>AYUSH THAKUR</span>
          <span className={styles.brandSubtitle}>
            {stats.totalNodes > 0 ? `${stats.totalNodes} Nodes · Universe` : 'Personal Digital Universe'}
          </span>
        </div>
      </Link>

      {/* 2. Fluid Tabs Primary Navigation (Center) */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsScrollTrack}>
          <div
            role="tablist"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5px',
              borderRadius: '9999px',
              border: '1.6px solid #232326',
              backgroundColor: '#141415',
              padding: '3px 4px',
              boxShadow:
                '0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
              userSelect: 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {navTabs.map((tab, index) => {
              const isActive = activeTabId === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabClick(tab)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onMouseEnter={() => setCursor('OPEN', tab.label.toUpperCase())}
                  onMouseLeave={resetCursor}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                    padding: '4px 8px',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {/* Sliding Spring Active Capsule */}
                  {isActive && (
                    <motion.div
                      layoutId="top-nav-active-pill"
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
                        background: 'linear-gradient(180deg, #353539 0%, #222225 100%)',
                        boxShadow:
                          '0 4px 14px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Tab Label, Icon with Fluid Micro-Blur */}
                  <motion.div
                    transition={{
                      duration: 0.28,
                      ease: 'easeOut',
                    }}
                    animate={{
                      filter: isActive
                        ? ['blur(0px)', 'blur(3px)', 'blur(0px)']
                        : 'blur(0px)',
                    }}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.77rem',
                      fontWeight: isActive ? 650 : 500,
                      color: isActive ? '#ffffff' : '#72727a',
                      fontFamily:
                        'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s ease',
                    }}
                  >
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
                        color: isActive ? '#ffffff' : '#72727a',
                      }}
                    >
                      {tab.icon}
                    </motion.div>

                    <span>{tab.label}</span>

                    {tab.badge !== undefined && (
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '999px',
                          background: isActive
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'rgba(255, 255, 255, 0.08)',
                          color: isActive ? '#ffffff' : '#8e8e96',
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
        </div>
      </div>

      {/* 3. Action Controls (Right) */}
      <div className={styles.actionsArea}>
        <button
          type="button"
          className={styles.newBtn}
          onClick={onOpenCreateNode}
          title="Create a new node in your universe"
        >
          <Plus size={14} />
          <span>New Node</span>
        </button>

        <button
          type="button"
          className={styles.cmdBtn}
          onClick={onOpenCommandPalette}
          title="Global Search and Commands (⌘K)"
        >
          <Search size={13} />
          <span>Search</span>
          <span className={styles.kbdBadge}>⌘K</span>
        </button>

        <button
          type="button"
          className={styles.audioBtn}
          onClick={() => setPlayerExpanded(true)}
          title="Open Audio Room & Spotify Sanctuary"
          style={{
            color: isPlaying ? '#1ed760' : '#8e8e9c',
            borderColor: isPlaying ? 'rgba(29, 185, 84, 0.4)' : 'rgba(255, 255, 255, 0.1)',
            background: isPlaying ? 'rgba(29, 185, 84, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          }}
        >
          <Music2 size={14} className={isPlaying ? 'animate-pulse' : ''} />
        </button>
      </div>
    </header>
  );
}

export default TopNavigation;
