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
  Sparkles
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onOpenCreateNode?: () => void;
  onOpenCommandPalette?: () => void;
}

export function Sidebar({ onOpenCreateNode, onOpenCommandPalette }: SidebarProps) {
  const pathname = usePathname();
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
    { href: '/cinema', label: 'Cinematheque', icon: Film },
    { href: '/library', label: 'Library', icon: BookOpen },
    { href: '/ideas', label: 'Ideas & Beliefs', icon: Lightbulb },
    { href: '/roadmaps', label: 'Roadmaps & Skills', icon: Milestone },
    { href: '/fitness', label: 'Body & Fitness', icon: Dumbbell },
    { href: '/vocabulary', label: 'Vocabulary', icon: BookA },
    { href: '/timeline', label: 'Life Timeline', icon: History },
    { href: '/inbox', label: 'Inbox', icon: Inbox, badge: stats.inboxCount > 0 ? stats.inboxCount : undefined },
    { href: '/me', label: 'Me (Atlas of Self)', icon: User }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoText}>
          NICHE MAXING
          <span className={styles.logoBadge}>PRO</span>
        </div>
        <div className={styles.domainTag}>niche.ayushthakur.space</div>
      </div>

      <nav className={styles.navSection}>
        <div className={styles.sectionLabel}>The Universe</div>
        {navLinks.slice(0, 2).map(link => {
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
        {navLinks.slice(2, 8).map(link => {
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
        {navLinks.slice(8).map(link => {
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
