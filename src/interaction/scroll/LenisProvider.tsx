'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices to preserve native touch momentum on mobile
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      allowNestedScroll: true,
      prevent: (node: HTMLElement) => {
        return Boolean(node.closest('aside') || node.closest('[data-lenis-prevent]'));
      },
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Initial resize after microtask to account for initial DOM render
    const timer = setTimeout(() => {
      lenis.resize();
    }, 120);

    const handleWindowResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleWindowResize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Recalculate document dimensions on route transition
  useEffect(() => {
    if (lenisRef.current) {
      const timer = setTimeout(() => {
        lenisRef.current?.resize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <>{children}</>;
}
