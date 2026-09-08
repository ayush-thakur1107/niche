'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { QuickCaptureModal } from './QuickCaptureModal';
import { CreateNodeModal } from '../common/CreateNodeModal';
import { UniverseFooter } from './UniverseFooter';
import { SmartCursor } from '@/interaction/cursor/SmartCursor';
import { LenisProvider } from '@/interaction/scroll/LenisProvider';
import { PersistentMusicPlayer } from '@/interaction/audio/PersistentMusicPlayer';
import styles from '@/app/layout.module.css';

export function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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

  const mainRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!mainRef.current) return;
      gsap.fromTo(
        mainRef.current,
        {
          opacity: 0.5,
          filter: 'blur(2px)'
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.25,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    },
    { dependencies: [pathname] }
  );

  return (
    <LenisProvider>
      <SmartCursor />
      <div className={styles.appContainer}>
        <Sidebar
          onOpenCreateNode={() => setIsCreateNodeOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main ref={mainRef} className={styles.mainContent}>
          {children}
          {pathname !== '/atlas' && <UniverseFooter />}
        </main>

        <PersistentMusicPlayer />

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
          onNodeCreated={(node) => {
            setIsCreateNodeOpen(false);
            if (pathname !== '/atlas') {
              router.push(`/node/${node.slug || node.id}`);
            }
          }}
        />
      </div>
    </LenisProvider>
  );
}
