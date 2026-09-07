'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { QuickCaptureModal } from './QuickCaptureModal';
import { CreateNodeModal } from '../common/CreateNodeModal';
import styles from '@/app/layout.module.css';

export function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isCreateNodeOpen, setIsCreateNodeOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / textarea
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // 'N' for Quick Capture (only if not typing in input)
      if (!isInput && (e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.appContainer}>
      <Sidebar
        onOpenCreateNode={() => setIsCreateNodeOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main className={styles.mainContent}>
        {children}
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCreateNode={() => {
          setIsCommandPaletteOpen(false);
          setIsCreateNodeOpen(true);
        }}
        onOpenQuickCapture={() => {
          setIsCommandPaletteOpen(false);
          setIsQuickCaptureOpen(true);
        }}
      />

      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />

      <CreateNodeModal
        isOpen={isCreateNodeOpen}
        onClose={() => setIsCreateNodeOpen(false)}
      />
    </div>
  );
}
