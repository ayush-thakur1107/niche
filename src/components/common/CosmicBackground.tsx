'use client';

import React, { useEffect, useRef } from 'react';
import styles from './cosmic-background.module.css';

interface Star {
  x: number;
  y: number;
  z: number; // 0.1 to 1.0 (depth layer)
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  colorType: 'white' | 'blue' | 'warm';
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse tracking for 3D parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized between -1 and 1
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const updateDimensions = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Generate stars with authentic distribution
    const calculateStarCount = () => {
      const area = width * height;
      // ~180 to 260 stars on typical 1080p desktop
      return Math.min(Math.max(Math.floor(area / 6500), 100), 300);
    };

    const count = calculateStarCount();
    const stars: Star[] = [];

    for (let i = 0; i < count; i++) {
      const z = Math.random() * 0.9 + 0.1; // 0.1 (far) to 1.0 (close)
      
      // Radius scaled slightly by depth
      const radius = z > 0.85 ? Math.random() * 1.2 + 1.6 : Math.random() * 0.9 + 0.6;
      
      // Far stars are slightly dimmer, close stars brighter
      const baseAlpha = z > 0.7 ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4 + 0.25;

      // Color variation: 80% icy white, 15% stellar cyan/blue, 5% subtle warm star
      const colorRoll = Math.random();
      let colorType: 'white' | 'blue' | 'warm' = 'white';
      if (colorRoll > 0.85) colorType = 'blue';
      else if (colorRoll < 0.05) colorType = 'warm';

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        radius,
        baseAlpha,
        twinkleSpeed: Math.random() * 1.5 + 0.8,
        twinklePhase: Math.random() * Math.PI * 2,
        // Drift speeds: very gentle floating motion
        vx: (Math.random() - 0.5) * 0.15 * z,
        vy: (Math.random() - 0.5) * 0.18 * z - 0.03 * z, // slight upward float
        colorType,
      });
    }

    let isTabActive = true;
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    // Render loop
    const render = (now: number) => {
      if (!isTabActive) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse interpolation (LERP)
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const timeSec = now * 0.001;

      // Draw all stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Update positions with drift
        star.x += star.vx * (delta * 60);
        star.y += star.vy * (delta * 60);

        // Screen wrap with 20px margin
        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        // Interactive 3D Parallax offset (stronger on closer stars)
        const parallaxFactor = star.z * 24;
        const renderX = star.x + currentMouseX * parallaxFactor;
        const renderY = star.y + currentMouseY * parallaxFactor;

        // Twinkle calculation
        const twinkle = 0.7 + 0.3 * Math.sin(timeSec * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.max(0, Math.min(1, star.baseAlpha * twinkle));

        // Color string
        let rgb = '240, 246, 255'; // crisp icy white
        if (star.colorType === 'blue') {
          rgb = '150, 205, 255'; // cosmic cyan/blue
        } else if (star.colorType === 'warm') {
          rgb = '255, 235, 205'; // warm starlight
        }

        // Foreground stars have a soft luminous halo
        if (star.z > 0.75 && star.radius > 1.4) {
          const glowGrad = ctx.createRadialGradient(
            renderX,
            renderY,
            0,
            renderX,
            renderY,
            star.radius * 3.5
          );
          glowGrad.addColorStop(0, `rgba(${rgb}, ${alpha * 0.95})`);
          glowGrad.addColorStop(0.35, `rgba(${rgb}, ${alpha * 0.4})`);
          glowGrad.addColorStop(1, `rgba(${rgb}, 0)`);

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sharp core
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className={styles.cosmicContainer} aria-hidden="true">
      <div className={styles.cosmicGlow} />
      <canvas ref={canvasRef} className={styles.cosmicCanvas} />
    </div>
  );
}
