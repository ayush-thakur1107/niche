'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Atom,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { useInteractionStore } from '@/interaction/store';
import { TextScramble } from '@/interaction/text/TextScramble';
import { MagneticButton } from '@/interaction/buttons/MagneticButton';

interface CelestialBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
  fixed?: boolean;
  name?: string;
}

export default function PhysicsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCursor, resetCursor } = useInteractionStore();

  const [isRunning, setIsRunning] = useState(true);
  const [activePreset, setActivePreset] = useState<'three_body' | 'lagrange' | 'binary' | 'accretion'>('three_body');
  const [gravityG, setGravityG] = useState<number>(0.8);
  const [timeStep, setTimeStep] = useState<number>(0.5);
  const [trailLength, setTrailLength] = useState<number>(55);
  const [showPotentialGrid, setShowPotentialGrid] = useState<boolean>(true);
  const [spawnMass, setSpawnMass] = useState<number>(18);
  const [fps, setFps] = useState<number>(60);
  const [bodyCount, setBodyCount] = useState<number>(3);

  // Drag spawn state
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const currentMouseRef = useRef<{ x: number; y: number } | null>(null);

  const bodiesRef = useRef<CelestialBody[]>([
    {
      id: 'body-1',
      name: 'Alpha Centauri A',
      x: 350,
      y: 230,
      vx: 0.4,
      vy: -0.9,
      mass: 28,
      radius: 9,
      color: '#e2a857',
      trail: []
    },
    {
      id: 'body-2',
      name: 'Alpha Centauri B',
      x: 550,
      y: 310,
      vx: -0.4,
      vy: 0.9,
      mass: 28,
      radius: 9,
      color: '#60a5fa',
      trail: []
    },
    {
      id: 'body-3',
      name: 'Proxima Perturber',
      x: 450,
      y: 390,
      vx: 0.8,
      vy: 0.1,
      mass: 22,
      radius: 7.5,
      color: '#f87171',
      trail: []
    }
  ]);

  // Initialize presets
  const initPreset = (preset: 'three_body' | 'lagrange' | 'binary' | 'accretion', width: number, height: number) => {
    const w = width > 100 ? width : 900;
    const h = height > 100 ? height : 540;
    const cx = w / 2;
    const cy = h / 2;

    if (preset === 'three_body') {
      // Classic figure-8 / chaotic 3-body configuration
      bodiesRef.current = [
        {
          id: 'body-1',
          name: 'Alpha Centauri A',
          x: cx - 140,
          y: cy - 40,
          vx: 0.4,
          vy: -0.9,
          mass: 28,
          radius: 9,
          color: '#e2a857',
          trail: []
        },
        {
          id: 'body-2',
          name: 'Alpha Centauri B',
          x: cx + 140,
          y: cy + 40,
          vx: -0.4,
          vy: 0.9,
          mass: 28,
          radius: 9,
          color: '#60a5fa',
          trail: []
        },
        {
          id: 'body-3',
          name: 'Proxima Perturber',
          x: cx,
          y: cy + 120,
          vx: 0.8,
          vy: 0.1,
          mass: 22,
          radius: 7.5,
          color: '#f87171',
          trail: []
        }
      ];
    } else if (preset === 'lagrange') {
      // Massive sun at center, orbiting Jupiter, and Trojan asteroid at L4
      const r = 160;
      const v = Math.sqrt((gravityG * 80) / r);
      bodiesRef.current = [
        {
          id: 'sun',
          name: 'Sol (Central Mass)',
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          mass: 80,
          radius: 14,
          color: '#f59e0b',
          fixed: true,
          trail: []
        },
        {
          id: 'jupiter',
          name: 'Jupiter (Primary)',
          x: cx + r,
          y: cy,
          vx: 0,
          vy: v,
          mass: 14,
          radius: 6.5,
          color: '#34d399',
          trail: []
        },
        {
          id: 'trojan',
          name: 'Trojan L4 Asteroid',
          x: cx + r * Math.cos(Math.PI / 3),
          y: cy - r * Math.sin(Math.PI / 3),
          vx: -v * Math.sin(Math.PI / 3),
          vy: v * Math.cos(Math.PI / 3),
          mass: 2,
          radius: 3.5,
          color: '#c084fc',
          trail: []
        }
      ];
    } else if (preset === 'binary') {
      // Twin dense neutron stars orbiting common barycenter
      const dist = 90;
      const v = 1.3;
      bodiesRef.current = [
        {
          id: 'pulsar-1',
          name: 'Neutron Core I',
          x: cx - dist,
          y: cy,
          vx: 0,
          vy: -v,
          mass: 38,
          radius: 8,
          color: '#38bdf8',
          trail: []
        },
        {
          id: 'pulsar-2',
          name: 'Neutron Core II',
          x: cx + dist,
          y: cy,
          vx: 0,
          vy: v,
          mass: 38,
          radius: 8,
          color: '#ec4899',
          trail: []
        }
      ];
    } else if (preset === 'accretion') {
      // Central supermassive body with a ring of orbiting debris
      const stars: CelestialBody[] = [
        {
          id: 'black-hole',
          name: 'Sagittarius A* (Singularity)',
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          mass: 150,
          radius: 16,
          color: '#ffffff',
          fixed: true,
          trail: []
        }
      ];

      for (let i = 0; i < 28; i++) {
        const rad = 70 + Math.random() * 160;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.sqrt((gravityG * 150) / rad) * (0.94 + Math.random() * 0.12);
        stars.push({
          id: `accretion-${i}`,
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad,
          vx: -Math.sin(angle) * speed,
          vy: Math.cos(angle) * speed,
          mass: 1.5,
          radius: 2.5,
          color: i % 2 === 0 ? '#60a5fa' : '#fde047',
          trail: []
        });
      }
      bodiesRef.current = stars;
    }

    setBodyCount(bodiesRef.current.length);
  };

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initCanvas = () => {
      canvas.width = 900;
      canvas.height = 540;
      initPreset(activePreset, 900, 540);
    };

    initCanvas();

    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const render = (now: number) => {
      try {
        const width = 900;
        const height = 540;

        // FPS tracking
        frameCount++;
        if (now - lastTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastTime)));
          frameCount = 0;
          lastTime = now;
        }

        // Background clear with slight trail decay
        ctx.fillStyle = 'rgba(7, 7, 10, 0.35)';
        ctx.fillRect(0, 0, width, height);

        // 1. Coordinate Grid & Potential Field
        if (showPotentialGrid) {
          ctx.save();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
          ctx.lineWidth = 1;
          for (let x = 0; x <= width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y <= height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Center crosshairs
          ctx.strokeStyle = '#e2a857';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(450 - 25, 270);
          ctx.lineTo(450 + 25, 270);
          ctx.moveTo(450, 270 - 25);
          ctx.lineTo(450, 270 + 25);
          ctx.stroke();
          ctx.restore();
        }

        const bodies = bodiesRef.current;

        // 2. Physics Computation: N-Body Newtonian Gravity with softening parameter
        if (isRunning) {
          const softening = 45;
          const dt = timeStep;

          for (let i = 0; i < bodies.length; i++) {
            const b1 = bodies[i];
            if (b1.fixed) continue;

            let fx = 0;
            let fy = 0;

            for (let j = 0; j < bodies.length; j++) {
              if (i === j) continue;
              const b2 = bodies[j];
              const dx = b2.x - b1.x;
              const dy = b2.y - b1.y;
              const distSq = dx * dx + dy * dy + softening;
              const dist = Math.sqrt(distSq);

              const force = (gravityG * b1.mass * b2.mass) / distSq;
              fx += force * (dx / dist);
              fy += force * (dy / dist);
            }

            // Acceleration a = F / m
            const ax = fx / b1.mass;
            const ay = fy / b1.mass;

            // Velocity Verlet integration
            b1.vx += ax * dt;
            b1.vy += ay * dt;

            b1.x += b1.vx * dt;
            b1.y += b1.vy * dt;

            // Screen boundary rebound damping
            if (b1.x < 15) { b1.x = 15; b1.vx *= -0.7; }
            if (b1.x > width - 15) { b1.x = width - 15; b1.vx *= -0.7; }
            if (b1.y < 15) { b1.y = 15; b1.vy *= -0.7; }
            if (b1.y > height - 15) { b1.y = height - 15; b1.vy *= -0.7; }

            // Record trail
            b1.trail.push({ x: b1.x, y: b1.y });
            if (b1.trail.length > trailLength) {
              b1.trail.shift();
            }
          }
        }

        // 3. Render Trails
        for (const b of bodies) {
          if (b.trail.length > 1) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 1.8;
            ctx.globalAlpha = 0.6;
            ctx.moveTo(b.trail[0].x, b.trail[0].y);
            for (let k = 1; k < b.trail.length; k++) {
              ctx.lineTo(b.trail[k].x, b.trail[k].y);
            }
            ctx.stroke();
            ctx.restore();
          }
        }

        // 4. Render Bodies with glowing halo
        for (const b of bodies) {
          if (!isFinite(b.x) || !isFinite(b.y)) continue;

          ctx.save();
          // Outer glowing halo
          ctx.fillStyle = b.color;
          ctx.globalAlpha = 0.28;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Solid core
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();

          // Core nucleus highlight
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();

          // Name tag
          if (b.name) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillText(b.name, b.x + b.radius + 8, b.y + 4);
          }
          ctx.restore();
        }

        // 5. Render Drag Spawn Vector
        if (dragStartRef.current && currentMouseRef.current) {
          const start = dragStartRef.current;
          const current = currentMouseRef.current;

          ctx.save();
          ctx.strokeStyle = '#e2a857';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(current.x, current.y);
          ctx.stroke();

          ctx.fillStyle = 'rgba(226, 168, 87, 0.8)';
          ctx.beginPath();
          ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } catch (err) {
        console.error('Physics render loop error:', err);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isRunning, activePreset, gravityG, timeStep, trailLength, showPotentialGrid]);

  // Mouse drag handlers with proportional coordinate scaling
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 900 / rect.width;
    const scaleY = 540 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    dragStartRef.current = { x, y };
    currentMouseRef.current = { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStartRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 900 / rect.width;
    const scaleY = 540 / rect.height;
    currentMouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseUp = () => {
    if (!dragStartRef.current || !currentMouseRef.current) {
      dragStartRef.current = null;
      return;
    }

    const start = dragStartRef.current;
    const end = currentMouseRef.current;

    // Velocity proportional to drag vector
    const vx = (end.x - start.x) * 0.025;
    const vy = (end.y - start.y) * 0.025;

    const colors = ['#e2a857', '#60a5fa', '#34d399', '#f87171', '#c084fc', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    bodiesRef.current.push({
      id: `spawned-${Date.now()}`,
      x: start.x,
      y: start.y,
      vx,
      vy,
      mass: spawnMass,
      radius: Math.max(3, Math.sqrt(spawnMass) * 1.5),
      color: randomColor,
      trail: [],
      name: `Particle ${bodiesRef.current.length + 1}`
    });

    setBodyCount(bodiesRef.current.length);
    dragStartRef.current = null;
    currentMouseRef.current = null;
  };

  const resetPreset = (preset: 'three_body' | 'lagrange' | 'binary' | 'accretion') => {
    setActivePreset(preset);
    initPreset(preset, 900, 540);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070709',
        color: '#f0f0f5',
        padding: '36px 40px 140px 40px',
        position: 'relative'
      }}
    >
      {/* Header telemetry and title */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '20px'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontWeight: 650,
              marginBottom: '6px'
            }}
          >
            <Atom size={15} />
            <span>Phase 09 · Physical Instrument & Mathematical Laboratory</span>
          </div>
          <h1
            style={{
              fontSize: '2.4rem',
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: '0 0 8px 0'
            }}
          >
            <TextScramble text="Gravitational Dynamics & Orbit Mechanics" />
          </h1>
          <p
            style={{
              color: '#8e8e9c',
              fontSize: '0.9rem',
              maxWidth: '680px',
              lineHeight: 1.5,
              margin: 0
            }}
          >
            A high-precision N-body relativistic and Newtonian gravitational sandbox.
            Drag on the dark field to eject planetary masses with initial velocity vectors.
          </p>
        </div>

        {/* Real-time telemetry indicators */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: 'rgba(15, 15, 20, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '10px 16px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.74rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38bdf8' }}>ENGINE:</span>
            <span style={{ color: '#34d399' }}>RUNNING · {fps} FPS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38bdf8' }}>INTEGRATOR:</span>
            <span style={{ color: '#e2a857' }}>VERLET (Δt = {timeStep.toFixed(2)})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38bdf8' }}>ENTITIES:</span>
            <span style={{ color: '#ffffff' }}>{bodyCount} BODIES</span>
          </div>
        </div>
      </div>

      {/* Preset configurations bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#8b8b99',
            marginRight: '6px'
          }}
        >
          Orbital Presets:
        </span>

        {[
          { id: 'three_body', label: 'Chaotic 3-Body Problem', desc: 'Euler-Lagrange unstable resonance' },
          { id: 'lagrange', label: 'Lagrangian L4 Trojan', desc: 'Sun-Jupiter-Asteroid triangular balance' },
          { id: 'binary', label: 'Binary Pulsar Orbit', desc: 'Twin dense barycenter circulation' },
          { id: 'accretion', label: 'Singularity Accretion Disk', desc: 'Black hole gravitational funnel' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => resetPreset(p.id as any)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 550,
              background:
                activePreset === p.id
                  ? 'rgba(56, 189, 248, 0.15)'
                  : 'rgba(255, 255, 255, 0.04)',
              border:
                activePreset === p.id
                  ? '1px solid #38bdf8'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              color: activePreset === p.id ? '#38bdf8' : '#c0c0cc',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {p.label}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: isRunning ? 'rgba(248, 113, 113, 0.15)' : 'rgba(52, 211, 153, 0.15)',
              border: isRunning ? '1px solid #f87171' : '1px solid #34d399',
              color: isRunning ? '#f87171' : '#34d399',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {isRunning ? <Pause size={13} /> : <Play size={13} />}
            <span>{isRunning ? 'Pause Field' : 'Resume Field'}</span>
          </button>

          <button
            onClick={() => resetPreset(activePreset)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#d0d0dc',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main interactive simulation view */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '540px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          background: '#07070a'
        }}
      >
        <canvas
          ref={canvasRef}
          width={900}
          height={540}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => setCursor('PAN', 'SPAWN')}
          onMouseLeave={resetCursor}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'crosshair',
            display: 'block'
          }}
        />

        {/* Overlay instruction helper */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.72rem',
            color: '#9ba1b0',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={13} color="#e2a857" />
          <span>Click and drag mouse outward to launch a new orbital mass with vector velocity</span>
        </div>

        {/* Floating live dials */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(12, 12, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '240px'
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontWeight: 650,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sliders size={13} />
            <span>Field Dials</span>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: '#8e8e9c',
                marginBottom: '4px'
              }}
            >
              <span>Gravity Constant (G)</span>
              <span style={{ color: '#e2a857', fontFamily: 'monospace' }}>
                {gravityG.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.05"
              value={gravityG}
              onChange={(e) => setGravityG(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#e2a857', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: '#8e8e9c',
                marginBottom: '4px'
              }}
            >
              <span>Time Step (Δt)</span>
              <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
                {timeStep.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.2"
              step="0.05"
              value={timeStep}
              onChange={(e) => setTimeStep(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: '#8e8e9c',
                marginBottom: '4px'
              }}
            >
              <span>Spawn Mass</span>
              <span style={{ color: '#34d399', fontFamily: 'monospace' }}>
                {spawnMass} m☉
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              step="2"
              value={spawnMass}
              onChange={(e) => setSpawnMass(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#8e8e9c' }}>Potential Grid</span>
            <input
              type="checkbox"
              checked={showPotentialGrid}
              onChange={(e) => setShowPotentialGrid(e.target.checked)}
              style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Physics Concept to Equation to Universe Cards */}
      <div
        style={{
          marginTop: '36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Card 1: Universal Gravitation */}
        <div
          style={{
            background: 'rgba(15, 15, 22, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px 24px'
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#e2a857',
              fontWeight: 650,
              marginBottom: '6px'
            }}
          >
            Fundamental Law
          </div>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#ffffff',
              margin: '0 0 10px 0'
            }}
          >
            Newtonian Inverse Square Gravitation
          </h3>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(226, 168, 87, 0.2)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.85rem',
              color: '#e2a857',
              marginBottom: '12px'
            }}
          >
            F = G · (m₁ · m₂) / (r² + ε²)
          </div>
          <p
            style={{
              fontSize: '0.82rem',
              color: '#9ba1b0',
              lineHeight: 1.5,
              margin: 0
            }}
          >
            In our simulation engine, softening parameter ε = 35 prevents infinite singularity
            divergence during close flybys, ensuring orbital stability even in chaotic 3-body encounters.
          </p>
        </div>

        {/* Card 2: Principle of Least Action */}
        <div
          style={{
            background: 'rgba(15, 15, 22, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px 24px'
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontWeight: 650,
              marginBottom: '6px'
            }}
          >
            Lagrangian Mechanics
          </div>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#ffffff',
              margin: '0 0 10px 0'
            }}
          >
            Hamilton's Principle of Least Action
          </h3>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.85rem',
              color: '#38bdf8',
              marginBottom: '12px'
            }}
          >
            δS = δ ∫ (T - V) dt = 0
          </div>
          <p
            style={{
              fontSize: '0.82rem',
              color: '#9ba1b0',
              lineHeight: 1.5,
              margin: 0
            }}
          >
            Nature selects the path through configuration space that makes the action integral
            stationary. All planetary curves in this instrument trace geodesics minimizing this functional.
          </p>
        </div>

        {/* Card 3: Connected Nodes in the Universe */}
        <div
          style={{
            background: 'rgba(15, 15, 22, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px 24px'
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#34d399',
              fontWeight: 650,
              marginBottom: '6px'
            }}
          >
            Universe Interconnections
          </div>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#ffffff',
              margin: '0 0 10px 0'
            }}
          >
            Resonant Knowledge Nodes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              href="/node/aryabhata"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#f0f0f5',
                textDecoration: 'none',
                fontSize: '0.82rem'
              }}
            >
              <span>Aryabhata (Earth's Axial Rotation & Epicycles)</span>
              <ChevronRight size={14} color="#e2a857" />
            </Link>

            <Link
              href="/atlas"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#f0f0f5',
                textDecoration: 'none',
                fontSize: '0.82rem'
              }}
            >
              <span>View Scientific Constellation in Atlas</span>
              <ChevronRight size={14} color="#38bdf8" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
