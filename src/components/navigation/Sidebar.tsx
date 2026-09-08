'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Sparkles,
  Atom,
  Archive,
  Music2,
  ExternalLink
} from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onOpenCreateNode?: () => void;
  onOpenCommandPalette?: () => void;
}

export function Sidebar({ onOpenCreateNode, onOpenCommandPalette }: SidebarProps) {
  const pathname = usePathname();
  const { setPlayerExpanded } = useInteractionStore();
  const [stats, setStats] = useState<{ totalNodes: number; inboxCount: number }>({
    totalNodes: 0,
    inboxCount: 0
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats({
            totalNodes: data.totalNodes || 0,
            inboxCount: data.inboxCount || 0
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Compass },
    { href: '/atlas', label: 'Atlas Universe', icon: Map, badge: stats.totalNodes },
    { href: '/lab', label: 'Interaction Lab', icon: Sparkles },
    { href: '/cinema', label: 'Cinematheque', icon: Film },
    { href: '/library', label: 'Library', icon: BookOpen },
    { href: '/ideas', label: 'Ideas & Beliefs', icon: Lightbulb },
    { href: '/roadmaps', label: 'Roadmaps & Skills', icon: Milestone },
    { href: '/fitness', label: 'Body & Fitness', icon: Dumbbell },
    { href: '/vocabulary', label: 'Vocabulary', icon: BookA },
    { href: '/physics', label: 'Physics Lab', icon: Atom },
    { href: '/museum', label: 'Museum (Curiosities)', icon: Archive },
    { href: '/timeline', label: 'Life Timeline', icon: History },
    { href: '/inbox', label: 'Inbox', icon: Inbox, badge: stats.inboxCount > 0 ? stats.inboxCount : undefined },
    { href: '/me', label: 'Me (Atlas of Self)', icon: User }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoText}>Ayush Thakur</div>
        <div className={styles.domainTag}>ayushthakur.space</div>
      </div>

      <nav className={styles.navSection}>
        <div className={styles.sectionLabel}>The Universe</div>
        {navLinks.slice(0, 3).map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <div className={styles.itemContent}>
                <Icon className={styles.itemIcon} />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span className={styles.counterBadge}>{link.badge}</span>
              )}
            </Link>
          );
        })}

        <div className={styles.sectionLabel}>Disciplines & Taste</div>
        {navLinks.slice(3, 10).map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <div className={styles.itemContent}>
                <Icon className={styles.itemIcon} />
                <span>{link.label}</span>
              </div>
            </Link>
          );
        })}

        <div className={styles.sectionLabel}>Evolution & Capture</div>
        {navLinks.slice(10).map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <div className={styles.itemContent}>
                <Icon className={styles.itemIcon} />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span className={styles.counterBadge}>{link.badge}</span>
              )}
            </Link>
          );
        })}

        <div className={styles.sectionLabel}>Audio & Atmosphere</div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
          <Link
            href="/spotify"
            className={`${styles.navItem} ${pathname === '/spotify' ? styles.navItemActive : ''}`}
            style={{
              flex: 1,
              background: pathname === '/spotify' ? 'rgba(29, 185, 84, 0.2)' : 'rgba(29, 185, 84, 0.08)',
              border: '1px solid rgba(29, 185, 84, 0.28)',
              padding: '8px 10px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
            title="Open Spotify Sanctuary"
          >
            <div className={styles.itemContent} style={{ color: '#1ed760' }}>
              <Music2 size={15} color="#1ed760" />
              <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.76rem' }}>
                Spotify Sanctuary
              </span>
            </div>
            <span
              style={{
                fontSize: '0.58rem',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(29, 185, 84, 0.2)',
                color: '#1ed760',
                padding: '1px 5px',
                borderRadius: '2px',
                border: '1px solid rgba(29, 185, 84, 0.35)'
              }}
            >
              ACCESS
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setPlayerExpanded(true)}
            style={{
              background: 'rgba(29, 185, 84, 0.08)',
              border: '1px solid rgba(29, 185, 84, 0.25)',
              borderRadius: '4px',
              padding: '0 8px',
              color: '#1ed760',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Open Quick Player Overlay"
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </nav>

      <div className={styles.footerActions}>
        <button
          className={styles.primaryActionBtn}
          onClick={onOpenCreateNode}
          title="Create a new node in your universe"
        >
          <Plus size={15} />
          <span>New Node</span>
        </button>

        <button
          className={styles.commandPaletteBtn}
          onClick={onOpenCommandPalette}
          title="Global Search and Commands"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={13} />
            <span>Command Palette</span>
          </div>
          <span className={styles.kbdTag}>⌘K</span>
        </button>
      </div>
    </aside>
  );
}
